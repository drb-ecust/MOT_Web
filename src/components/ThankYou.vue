<!--
程序名：感谢页面
功能：填写完问卷跳转的页面
-->
<template>
  <div class="thankYou">
    <el-card shadow="never" style="font-size: 18px;line-height: 40px;padding: 10px;">
      <i class="el-icon-circle-check" style="color: green;font-size: 50px"></i><br>
      下单成功，感谢您的惠顾！<br><br>
      <el-divider></el-divider>
      <el-link type="info" href="/index">回到首页</el-link>
    </el-card>
  </div>
</template>
<style scoped>
  .thankYou{
    padding: 40px;
  }
</style>
<style>
  .el-divider--horizontal{
    margin: 10px;
  }
</style>
