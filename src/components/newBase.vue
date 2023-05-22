<template>
  <div class="main">
      <el-container>
          <el-header style="background:white;">
              <el-row>
                  <el-col :span="5" style="background:white;border-bottom: solid 1px #e6e6e6;">
                    <div class="logo" @click="toIndex">
                            <!-- <img src="/static/images/logo.png" class="logoImg"> -->
                            <!-- <span style="color: #303133">外卖宝</span> -->
                            <span style="font-size: 15px;margin-left: 5px;color: #303133">基于自动驾驶中点云数据的多目标跟踪系统</span>
                    </div>
                  </el-col>
                    <el-col :span="19">
                        <div class="menu">
                            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                                <el-menu-item index="1" @click="toIndex">首页</el-menu-item>
                                <el-menu-item index="2" @click="toWjList">跟踪效果</el-menu-item>
                                <el-menu-item index="3" @click="toDesign">历史信息</el-menu-item>
                                <el-menu-item index="4" @click="toAnswer">后台管理</el-menu-item>
                                <div style="float: right;margin-right: 50px;line-height: 60px;">
                                <!-- 未登录时显示 -->
                                    <template v-if="!showname">
                                        <el-button type="primary" plain style="font-size: 15px;" @click="toLogin">登录</el-button>
                                        <el-button plain style="font-size: 15px;" @click="toRegiste">注册</el-button>
                                    </template>
                                    <!-- 登录时显示 -->
                                    <template v-else>
                                        <!-- 登录成功，显示用户名 -->
                                        <el-dropdown trigger="click" @command="handleCommand">
                                        <span class="el-dropdown-link">
                                            {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                        <!-- 退出登录 -->
                                        <el-dropdown-menu slot="dropdown">
                                            
                                            <el-dropdown-item command="b">退出登录</el-dropdown-item>
                                        </el-dropdown-menu>
                                        </el-dropdown>
                                         欢迎您光临本网站！ 
                                    </template>
                                    
                                </div>
                            </el-menu>
                        </div>
                    </el-col>
              </el-row>
          </el-header>
          <el-main style="padding: 0">
        <router-view @state="state"/>
      </el-main>
      </el-container>
  </div>
</template>

<script>
import {designOpera} from './api';
export default {
    name:'newBase',
    
    data:function(){
        return{
            activeIndex: '1',
            activeIndex2: '1',
            showname:false,
            username:'',
            points:0,
        }
    },
    methods:{
        handleSelect(key, keyPath){
            console.log(key, keyPath);
        },
        toIndex(){
            this.$router.push({path:'/index'});
        },
        toDesign(){
            this.$router.push({path:'/list'});
        },
        toAnswer(){
            this.$router.push({path:'/ps'});
        },
         logincheck(){
          designOpera({
          opera_type:'logincheck',
        })
        .then(data=>{
          console.log(data);
          if(data.code==404){
            return false
          }
          else if(data.data!=null){
            console.log(data)
            sessionStorage.setItem('username',data.data.user) //将后端传的username存入session
          }
          this.state()  // 调用state方法
        })
      },
      // 跳转问卷管理页面方法
      toHome(){
        this.$router.push({path:'/design'})
      },
      // 跳转登录页面方法
      toLogin(){
        this.$router.push({path:'/login'})
      },
      // 跳转注册页面方法
      toRegiste(){
        this.$router.push({path:'/register'})
      },
      toWjList(){
        this.$router.push({path:'/design'})
      },
      //判断session中是否存在数据，存在将showname置为true，否则false
      state(){
        console.log('state')
        console.log(sessionStorage.getItem('username'))
        if(sessionStorage.getItem('username')!=null){
          this.showname=true;
          this.username = sessionStorage.getItem('username')
        }
        else {
          this.showname = false
        }
      },
      //下拉菜单操作
      handleCommand(command){
        if(command=='a'){
          this.toHome();
        }
        else if(command=='b'){
          this.exit();
        }
      },
      //登出
      exit(command){
        designOpera({
          opera_type:'exit',  // 操作类型
          username:sessionStorage.getItem('username')  //获取session中的用户名
        })
        .then(data=>{
          console.log(data);
          if(data.code==0){
            sessionStorage.clear()  //登出成功，清空session
            this.state()  // 调用state方法
            this.toLogin()  // 调用toLogin方法
          }
          else{
            this.$message({  // 报错友好提示
              type: 'error',
              message: '网络错误！',
              showClose: true
            });
          }
        })
      }
    },
    mounted(){
      var username = sessionStorage.getItem('username');
      this.logincheck();
     
     
          
        
    },
}
</script>

<style>
/* logo图片样式 */
  .logoImg{
    width: 30px;
    vertical-align: middle;
  }
  /* logo框样式 */
  .logo{
    height: 60px;
    display: inline-block;
    line-height: 60px;
    font-size: 20px;
    
    color: #303133;
    cursor: pointer;
  }

</style>