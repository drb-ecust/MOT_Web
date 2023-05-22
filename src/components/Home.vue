<!--
程序名：问卷设计主页面
功能：对问卷进行设计
-->
<template>
  <div class="home">
    <el-row>
      <el-col :span="4">
        <!--操作栏-->
        <div class="opera">
          
          
          <el-tooltip class="item" effect="dark" :content="nowSelect.status==0?'标记':'取消标记'" placement="bottom" >
            <el-button :icon="nowSelect.status==0?'el-icon-video-play':'el-icon-video-pause'"  type="text" class="rightButton" @click="pushWj" :disabled="nowSelect.id==0||nowSelect.id==null"></el-button>
          </el-tooltip>
          
          <el-tooltip class="item" effect="dark" content="删除记录" placement="bottom">
            <el-button icon="el-icon-delete" type="text" class="rightButton" @click="deleteWj" :disabled="nowSelect.id==0||nowSelect.id==null"></el-button>
          </el-tooltip>
         
          
        </div>

        <!--左侧导航栏-->
        <el-menu :default-active="defaultActive.toString()" v-loading="loading" class="menu" >
          <!--问卷列表-->
          <div style="width:100%;text-align: center;font-size: 15px;line-height: 20px;margin-top: 20px;color: #303133" v-if="nowSelect.id==0||nowSelect.id==null">
            暂时没有记录
          </div>
          <!-- <el-menu-item v-for="(item,index) in wjList" :index="(index+1).toString()" :key="item.id" @click="wjClick(item.id,index)">
            <i class="el-icon-tickets"></i>
            <span slot="title" style="display: inline-block">
              {{item.title}}
              <span style="color: #F56C6C;font-size: 13px;" v-if="item.status==0">
                <i class="el-icon-link" style="margin:0;font-size: 13px;color: #F56C6C;width:10px;"></i>
                
              </span>
              <span style="color: #67C23A;font-size: 13px;" v-if="item.status==1">
                <i class="el-icon-link" style="margin:0;font-size: 13px;color: #67C23A;width:10px;"></i>
                标记
              </span>
            </span>
          </el-menu-item> -->
          <el-menu-item @click="car()">
            <i class="el-icon-tickets"></i>
            <span slot="title" style="display: inline-block">
              车辆
              
              
            </span>
          </el-menu-item>
          <el-menu-item @click="pedestrain()">
            <i class="el-icon-tickets"></i>
            <span slot="title" style="display: inline-block">
              行人
              
              
            </span>
          </el-menu-item>
          <el-menu-item @click="cyclist()">
            <i class="el-icon-tickets"></i>
            <span slot="title" style="display: inline-block">
              自行车
            </span>
          </el-menu-item>
          <el-menu-item @click="combine()">
            <i class="el-icon-tickets" ></i>
            <span slot="title" style="display: inline-block">
              合并
              
              
            </span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="20">
        <!--标签页-->
        <el-card style="display:flex;margin-bottom:20px">
          <div style="margin:auto">基于自动驾驶中多目标跟踪结果</div>
          <div>序列：{{seq}}</div>
          <div>种类：{{cat}}</div>
        </el-card>
        <el-card>
          <img :src="imgSrc" v-if="show">
          <img :src="get3d" v-if="get3d">
          <el-button @click="get_3d()">点云可视化</el-button>
        </el-card>
         
      </el-col>
    </el-row>

   



    


   

  </div>
</template>
<script>
  import {designOpera} from './api'
  import Design from './Design.vue'
  import DataShow from './DataShow.vue'
  import ElButton from "../../node_modules/element-ui/packages/button/src/button";
  import QRCode from 'qrcode'
  export default{
    components:{
      ElButton,
      Design,
     
      DataShow,
    },
    data(){
      return{
        defaultActive:1,//当前激活菜单
        activeName:'wjsj',//标签页当前选择项
        wjList:[],//问卷列表
        loading:false,//是否显示加载中
        dialogShow:false,//添加问卷弹窗是否显示
        shareDialogShow:false,//分享问卷弹窗是否显示
        imgSrc:"http://127.0.0.1:8000/api/video_feed?seq=0008",
        cat:"",
        seq:2,
        get3d:"",
        show:false,
        willAddWj:{
          id:0,
          title:'',
          loc:'',
          tel:0
         
        },
        seq:0,
        

      }
    },
    mounted(){
      this.logincheck();
      this.getWjList();
    },
    computed:{
      //现在选中的问卷信息
      nowSelect(){
        console.log('nowSelect update');
        let now=this.wjList[this.defaultActive-1];
        if(this.wjList.length==0){
          return {
            id:null,
            title:null,
            loc:null,
            tel:null,
            status:null,
          }
        }
        return{
          id:now.id,
          title:now.title,
          loc:now.desc,
          tel: now.tel,
          status:now.status,
        }
      },
    },
    methods:{
      onInput(){
        this.$forceUpdate();
    },
    get_3d(){
      this.get3d = "http://127.0.0.1:8000/api/video_3d";
    },
    car(){
      this.cat = "Car";
      this.show = true;
      this.imgSrc = "http://127.0.0.1:8000/api/video_feed?seq=0000&cat=" + this.cat;
    },
    cyclist(){
      this.cat = "Cyclist";
      this.show = true;
      this.imgSrc = "http://127.0.0.1:8000/api/video_feed?seq=0000&cat=" + this.cat;
      console.log(this.imgSrc);
    },
    pedestrain(){
      this.cat = "Pedestrian";
      this.show = true;
      this.imgSrc = "http://127.0.0.1:8000/api/video_feed?seq=0000&cat=" + this.cat;
      console.log(this.imgSrc);
    },
    combine(){
      this.show = true;
      this.cat = "Combine";
      this.imgSrc = "http://127.0.0.1:8000/api/video_feed?seq=0000";
    },
    
      
     
      //检查登录是否过期
      logincheck(){
          designOpera({
          opera_type:'logincheck',
        })
        .then(data=>{
          console.log(data);
          if(data.code==404){//如果返回的错误是404，跳转到登录页面
            this.$message({
              type: 'error',
              message: '您还未登录，请登录',
              showClose: true
            });
            this.$router.push({path:'/login'})
          }
          else{
            this.getWjList();
          }
        })
      },
      //发布问卷/暂停问卷
      pushWj(){
        let status=1;
        if(this.nowSelect.status==1)
            status=0;
        designOpera({
          opera_type:'push_wj',
          username:'test',
          wjId:this.nowSelect.id,
          status:status
        })
          .then(data=>{
            console.log(data);
            if(data.code==0){
              this.$message({
                type: 'success',
                message: status==1?'店铺开业成功！':'店铺打烊成功！'
              });
              this.getWjList();
            }
            else{
              this.$message({
                type: 'error',
                message: data.msg
              });
            }
          })
      },
      
      
      
     
      
      //编辑问卷
      editWj(){
        this.dialogShow=true;
        this.willAddWj=this.nowSelect;
        console.log(this.nowSelect);
      },
      //添加问卷按钮点击
      addWjButtonClick(){
        this.dialogShow=true;
        this.willAddWj={
          title:'',
          loc:'',
          tel:0,
          id:null
     
        };
      },
      //添加问卷
      addWj(){
        
        if (this.willAddWj.title == ''){
          this.$message({
            type: 'error',
            message: '标题不能为空'
          });
          return;
        }
        designOpera({
          opera_type:'add_wj',
          username:'test',
          title: this.willAddWj.title,
          loc: this.willAddWj.loc,
          tel: this.willAddWj.tel,
          id: this.willAddWj.id
        })
          .then(data=>{
            console.log(data);
            if(data.code==0){
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.getWjList();
            }
            else{
              this.$message({
                type: 'error',
                message: data.msg
              });
            }
          });
        this.dialogShow=false;
        this.willAddWj.title='';
     
      },
      //获取问卷列表
      getWjList(){
        this.loading=true;
        designOpera({
          opera_type:'get_wj_list',
          username:'test'
        })
          .then(data=>{
            console.log(data);
            this.wjList=data.data.detail;
            this.wj
            this.loading=false;
            //获取当前选中问卷题目
            this.lookDetail();
          })
      },
      //删除问卷
      deleteWj(){
        this.$confirm('确定删除'+this.nowSelect.title+'? 删除后不可恢复！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading=true;
          designOpera({
          opera_type:'delete_wj',
          username:'test',
          id:this.nowSelect.id
        })
          .then(data=>{
            console.log(data);
            if(data.code==0){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.loading=false;
              this.getWjList();
              this.defaultActive=1;
            }
            else{
              this.$message({
                type: 'error',
                message: data.msg
              });
            }
          })
        });
      },
      //问卷点击
      wjClick(id,index){
        this.defaultActive=(index+1).toString();
        this.lookDetail();
      },
      //查看问卷详情
      lookDetail(){
        this.$refs.design.init(this.nowSelect.id,this.nowSelect.title,this.nowSelect.desc);
        console.log("id=")
        console.log(this.nowSelect.id)
     
      },
    }
  }
</script>
<style scoped>
  .home{
    position: absolute;
    width: 100%;
    height: calc(100vh - 100px);
    text-align: left;

  }
  .home .badgeItem{
    margin-top: 40px;
  }
  .content{
    padding: 20px;
    padding-right: 50px;
    height: calc(100vh - 175px);
    text-align: center;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .menu{
    background-color: white;
    height: calc(100vh - 100px);
    overflow-x: scroll;
    overflow-y: scroll;
    left: 0;
  }
  .home .opera{
    position: relative;
    background-color: #fafafa;
    text-align: center;
    height: 40px;
  }
  .home .rightButton{
    font-size: 16px;
  }
  .home .addWjDiv{
    height: 50px;line-height: 50px;text-align: center;
    border-bottom: 1px solid #eee
  }
</style>
