import { UserModel as User } from '../../models/data/user.js';
import { EventModel as Event } from '../../models/data/event.js';

const getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 999);

    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    // ✅ status: 'active' (string!)
    const totalUsers = await User.countDocuments({ status: 'active' });

    // ✅ time field (eventTime emas!)
    const todayEvents = await Event.aggregate([
      {
        $match: {
          time: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: '$user',
        },
      },
    ]);
    
    const presentToday = todayEvents.length;
    const absentToday = totalUsers - presentToday;
    const attendanceRate = totalUsers > 0 ? ((presentToday / totalUsers) * 100).toFixed(1) : 0;

    // Late arrivals (9:00 dan keyin)
    const lateArrivals = await Event.aggregate([
      {
        $match: {
          time: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $addFields: {
          localTime: { $add: ['$time', 5 * 60 * 60 * 1000] },
        },
      },
      {
        $addFields: {
          hour: { $hour: '$localTime' },
          minute: { $minute: '$localTime' },
        },
      },
      {
        $match: {
          $or: [{ hour: { $gt: 9 } }, { hour: 9, minute: { $gt: 0 } }],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          fullName: '$userInfo.fullName',
          employeeNo: '$userInfo.employeeNo',
          time: '$time',
          lateMinutes: {
            $subtract: [
              { $add: [{ $multiply: ['$hour', 60] }, '$minute'] },
              540,
            ],
          },
        },
      },
      { $sort: { lateMinutes: -1 } },
      { $limit: 10 },
    ]);

    // Weekly trend
    const weeklyTrend = await Event.aggregate([
      {
        $match: {
          time: { $gte: weekStart, $lte: todayEnd },
        },
      },
      {
        $addFields: {
          localDate: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: { $add: ['$time', 5 * 60 * 60 * 1000] },
            },
          },
        },
      },
      {
        $group: {
          _id: '$localDate',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ]);

    // By department
    const byDepartment = await User.aggregate([
      { $match: { status: 'active' } },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'deptInfo',
        },
      },
      { $unwind: { path: '$deptInfo', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'events',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$user', '$$userId'] },
                time: { $gte: todayStart, $lte: todayEnd },
              },
            },
            { $limit: 1 },
          ],
          as: 'todayEvent',
        },
      },
      {
        $group: {
          _id: '$deptInfo.name',
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $gt: [{ $size: '$todayEvent' }, 0] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          department: { $ifNull: ['$_id', 'No Department'] },
          total: 1,
          present: 1,
          absent: { $subtract: ['$total', '$present'] },
        },
      },
      { $sort: { department: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          total: totalUsers,
          present: presentToday,
          absent: absentToday,
          attendanceRate: parseFloat(attendanceRate),
          lateCount: lateArrivals.length,
        },
        lateArrivals,
        weeklyTrend,
        byDepartment,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi',
    });
  }
};

const getAbsentEmployees = async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const datesInRange = [];
    const current = new Date(start);
    while (current < end) {
      datesInRange.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    const totalDays = datesInRange.length;

    let userQuery = { status: 'active' };
    if (department) userQuery.department = department;

    const users = await User.find(userQuery)
      .populate('department', 'name')
      .select('fullName employeeNo department')
      .lean();

    const employeeStats = await Promise.all(
      users.map(async (user) => {
        const events = await Event.aggregate([
          {
            $match: {
              user: user._id,
              time: { $gte: start, $lt: end },
            },
          },
          {
            $addFields: {
              localDate: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: { $add: ['$time', 5 * 60 * 60 * 1000] },
                },
              },
            },
          },
          { $group: { _id: '$localDate' } },
        ]);

        const presentDays = events.length;
        const absentDays = totalDays - presentDays;
        const absentPercentage = totalDays > 0 ? ((absentDays / totalDays) * 100).toFixed(1) : 0;

        return {
          _id: user._id,
          fullName: user.fullName,
          employeeNo: user.employeeNo,
          department: user.department?.name || 'No Department',
          presentDays,
          absentDays,
          absentPercentage: parseFloat(absentPercentage),
        };
      })
    );

    const absentEmployees = employeeStats
      .filter((emp) => emp.absentDays > 0)
      .sort((a, b) => b.absentDays - a.absentDays);

    return res.status(200).json({
      success: true,
      data: {
        employees: absentEmployees,
        total: absentEmployees.length,
        period: { startDate, endDate, totalDays },
      },
    });
  } catch (error) {
    console.error('Absent employees error:', error);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
};

const getTopPerformers = async (req, res) => {
  try {
    const { period = 'month', limit = 10 } = req.query;
    const now = new Date();
    let daysBack = 30;
    if (period === 'week') daysBack = 7;
    if (period === 'year') daysBack = 365;

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysBack);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    const users = await User.find({ status: 'active' }).select('fullName employeeNo').lean();
    const performanceStats = await Promise.all(
      users.map(async (user) => {
        const events = await Event.aggregate([
          {
            $match: {
              user: user._id,
              time: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $addFields: {
              localDate: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: { $add: ['$time', 5 * 60 * 60 * 1000] },
                },
              },
            },
          },
          { $group: { _id: '$localDate' } },
        ]);

        const attendanceDays = events.length;
        const percentage = daysBack > 0 ? ((attendanceDays / daysBack) * 100).toFixed(1) : 0;

        return {
          _id: user._id,
          fullName: user.fullName,
          employeeNo: user.employeeNo,
          attendanceDays,
          totalDays: daysBack,
          percentage: parseFloat(percentage),
        };
      })
    );

    const topPerformers = performanceStats
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, parseInt(limit));

    return res.status(200).json({ success: true, data: { topPerformers, period } });
  } catch (error) {
    console.error('Top performers error:', error);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    const totalUsers = await User.countDocuments({ status: 'active' });
    const dailyStats = await Event.aggregate([
      {
        $match: {
          time: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $addFields: {
          localDate: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: { $add: ['$time', 5 * 60 * 60 * 1000] },
            },
          },
        },
      },
      {
        $group: {
          _id: '$localDate',
          uniqueUsers: { $addToSet: '$user' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          present: { $size: '$uniqueUsers' },
          absent: { $subtract: [totalUsers, { $size: '$uniqueUsers' }] },
        },
      },
      { $sort: { date: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: { month: targetMonth + 1, year: targetYear, totalUsers, dailyStats },
    });
  } catch (error) {
    console.error('Monthly report error:', error);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
};

const getTrend = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const now = new Date();
    let daysBack = 7;
    if (period === 'month') daysBack = 30;
    if (period === 'year') daysBack = 365;

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysBack);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    const trend = await Event.aggregate([
      {
        $match: {
          time: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $addFields: {
          localDate: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: { $add: ['$time', 5 * 60 * 60 * 1000] },
            },
          },
        },
      },
      { $group: { _id: '$localDate', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', count: 1 } },
    ]);

    return res.status(200).json({ success: true, data: trend });
  } catch (error) {
    console.error('Get trend error:', error);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
};

export default {
  getDashboard,
  getAbsentEmployees,
  getTopPerformers,
  getMonthlyReport,
  getTrend,
};
