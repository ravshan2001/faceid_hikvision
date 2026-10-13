<template>
  <div class="px-4 py-1 mainScroll">
    <img
      v-if="worker?.faceUrl"
      :src="`${url}/${worker?.faceUrl}`"
      alt=""
      class="w-full mt-4  m-auto rounded-[26px] block aspect-square object-cover 2xl:w-72 md-max:w-64 xm-max:w-56"
    />
    <img
      v-else
      class="max-w-80 mt-4 m-auto rounded-[26px] block aspect-square object-cover w-72 md-max:w-64"
      src="@/assets/images/avatar.png"
      alt=""
    />
    <div class="space-y-1 divide-y mt-2 px-2 w-full">
      <div class="py-2 flex items-center justify-between">
        <div class="text-xs text-gray-500 2xl:text-[12px]">Ф.И.О</div>
        <div class="text-base font-medium text-mainText 2xl:text-[14px]">
          {{ worker?.fullName }}
        </div>
      </div>
      <div class="py-2 flex items-center justify-between">
        <div class="text-xs text-gray-500 2xl:text-[12px]">Номер телефон</div>
        <div class="text-base font-medium text-mainText 2xl:text-[14px]">
          {{ worker?.phone }}
        </div>
      </div>
      <div class="py-2 flex items-center justify-between">
        <div class="text-xs text-gray-500 2xl:text-[12px]">Рол</div>
        <div class="text-base font-medium text-mainText 2xl:text-[14px]">
          {{ getRoleName(worker?.role, $i18n.locale) || '' }}
        </div>
      </div>
      <div class="py-2 flex items-center justify-between">
        <div class="text-xs text-gray-500 2xl:text-[12px]">Пол</div>
        <div class="text-base font-medium text-mainText 2xl:text-[14px]">
          {{ worker?.gender == 'male' ? 'Мужчина' : 'Женщина' }}
        </div>
      </div>
      <div class="py-2 flex items-center justify-between">
        <div class="text-xs text-gray-500 2xl:text-[12px]">Дата рождения</div>
        <div class="text-base font-medium text-mainText 2xl:text-[14px]">
          {{ convertDateShort(worker?.birthDay) }}
        </div>
      </div>
      <div class="py-2 flex items-center justify-between" v-if="worker?.address">
        <div class="text-xs text-gray-500 2xl:text-[12px]">Адрес</div>
        <div class="text-base font-medium text-mainText 2xl:text-[14px]">
          {{ worker?.address }}
        </div>
      </div>
      <div class="py-2 flex items-center justify-between">
        <div class="text-xs text-gray-500 2xl:text-[12px]">Дата регистрации</div>
        <div class="text-base font-medium text-mainText 2xl:text-[14px]">
          {{ convertDateShort(worker?.createdAt, 'full') }}
        </div>
      </div>
      
    </div>
  </div>
</template>
<script setup>
import { url } from '@/helpers/api'
import { role } from '@/helpers/object';
import { convertDateShort } from '@/helpers/func';
defineProps(['worker'])



// Ishchi rollarini oalmzi
const getRoleName = (roleId, locale) => {
  const roleItem = role.find((role) => role._id === roleId);
  return roleItem ? roleItem.name[locale] : '';
};
</script>
<style lang=""></style>