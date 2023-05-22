<!--
程序名：问卷填写页面
功能：用户打开问卷链接对问卷进行填写
-->
<template>
  <div class="display">
    <div class="content">
      <h3>{{title}}</h3>
      <div class="top" v-if="desc!=''">
        {{desc}}
      </div>
      <el-card class="box-card" v-for="(item,index) in detail">
        <div slot="header" class="clearfix">

          <div class="questionTitle">
            <!--显示必填标识-->
            <span style="color: #F56C6C;">
              <span v-if="item.must">*</span>
              <span v-else>&nbsp;</span>
            </span>
            {{(index+1)+'.'+item.title}}
          </div>
        </div>
        <div class="text item">
          <div class="">菜品种类：{{item.typename}}</div>
          <div>菜品描述：{{item.desc}}</div>
          <div>菜品价格：{{item.price}}</div>
          
          菜品数量：<el-input type="number" v-model="item.num" style="width:50%"></el-input>
        </div>
       

       


      </el-card>
      <el-card>
        地址：<el-input type="text" v-model="loc"></el-input>
      </el-card>
       <el-button type="primary" style="margin: 5px;" @click="submit" :loading="submitLoading">{{submitText}}</el-button>

      <div class="bottom">
        <el-link type="info" href="/index">回到首页</el-link>
      </div>
    </div>
  </div>
</template>

<script>
  import {answerOpera} from './api'
  import {designOpera} from './api'
  export default{
    data(){
      return{
        dialogShow:false,
        dialogTitle:'',
        dialogType:1,//1添加 2修改
        oldItem:null,//编辑中问题的对象
        willAddQuestion:{
          type:'',
          title:'',
          options:[''],
          text:'',
          row:1,
        },
      
        title:'',
        desc:'',
        detail:[],
        startTimestamp:0,//填写问卷开始时间戳 毫秒
        submitLoading:false,//提交按钮 加载中状态
        submitText:'提交',//提交按钮文字
        loc: '',
      }
    },
    mounted(){
      this.logincheck();
      var wjId=this.$route.params.id;
      answerOpera({
        opera_type:'get_info',
        wjId:wjId,
        username:'test'//增加登录验证后不需传递（后端从session获取）
      })
        .then(data=>{
          console.log(data);
          if(data.code==0){
            this.title=data.title;
            this.desc=data.desc;
            this.detail=data.detail;
            document.title=data.title;
          }
          else{
            this.$message({
              type: 'error',
              message: data.msg
            });
          }
        })
      this.startTimestamp=new Date().getTime();//时间戳 毫秒
    },
    methods:{
      //检查登录是否过期
      logincheck(){
          designOpera({
          opera_type:'logincheck',
        })
        .then(data=>{
          console.log(data);
          if(data.code==404){
            this.$router.push({path:'/login'});
          }
          else if(data.data!=null){
            console.log(data)
            sessionStorage.setItem('username',data.data.user) //将后端传的username存入session
          }
          this.state()  // 调用state方法
        })
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
      //提交问卷
      submit(){
        this.submitLoading=true;
        this.submitText='提交中';
        var wjId=this.$route.params.id;
        var username = sessionStorage.getItem('username');
        let useTime=parseInt((new Date().getTime()-this.startTimestamp)/1000);//填写问卷用时 秒
        answerOpera({
          opera_type:'submit_wj',
          wjId:wjId,
          useTime:useTime,
          username: username,
          detail:this.detail,
          loc: this.loc
        })
          .then(data=>{
            console.log(data);
            if(data.code==0){
              //提交成功
              this.submitLoading=false;
              this.submitText='提交';
              this.$router.push({path:'/thankyou'});//跳到欢迎页
            }
            else{
              this.submitLoading=false;
              this.submitText='提交';
              this.$notify.error({
                title: '错误',
                message: data.msg,
              });
            }
          })
      }
    }
  }
</script>
<style scoped>
  .display{
    text-align: center;
    padding: 20px;
  }
  .display .top{
    color: #606266;
    padding: 0 10px 10px 10px;
    border-bottom: 3px solid #409EFF;
    font-size: 15px;
    line-height: 22px;
    text-align: left;
  }
  .display .content{
    width: 100%;
    max-width: 800px;
    display: inline-block;
    text-align: center;
  }
  .display .box-card{
    text-align: left;
    width: 100%;
    margin:10px 0 10px 0;
  }
  .display .bottom{
    margin: 20px 10px 20px 10px;
    color: #909399;
  }
  .display a:link,a:visited,a:active {
    color: #909399;
    text-decoration:none;
  }
</style>
