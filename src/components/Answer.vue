<!--
程序名：问卷设计主页面
功能：对问卷进行设计
-->
<template>
  <div class="home">
    <el-row>
      <el-col :span="6">
        <!--操作栏-->
        <div class="opera">
          
        </div>

        <!--左侧导航栏-->
        <el-menu :default-active="defaultActive.toString()" v-loading="loading" class="menu" >
          <!--问卷列表-->
          <div style="width:100%;text-align: center;font-size: 15px;line-height: 20px;margin-top: 20px;color: #303133" v-if="nowSelect.id==0||nowSelect.id==null">
            请先创建第一个问卷
          </div>
          <el-menu-item v-for="(item,index) in wjList" :index="(index+1).toString()" :key="item.id" @click="wjClick(item.id,index)">
            <i class="el-icon-tickets"></i>
            <span slot="title" style="display: inline-block">
              {{item.title}}
              <span style="color: #F56C6C;font-size: 13px;" v-if="item.status==0">
                <i class="el-icon-link" style="margin:0;font-size: 13px;color: #F56C6C;width:10px;"></i>
                未发布
              </span>
              <span style="color: #67C23A;font-size: 13px;" v-if="item.status==1">
                <i class="el-icon-link" style="margin:0;font-size: 13px;color: #67C23A;width:10px;"></i>
                已发布
              </span>
            </span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="18">
        <!--标签页-->
         <el-tabs type="border-card" v-model="activeName">
            
            <el-tab-pane label="回答统计" name="hdtj">
              <div class="content" ref="pdf">
                <div v-show="nowSelect.id==0||nowSelect.id==null">请先选择问卷</div>
                <data-show ref="dataShow" v-show="nowSelect.id!=0&&nowSelect.id!=null"></data-show>
              </div>
            </el-tab-pane>
          </el-tabs>
      </el-col>
    </el-row>

   



  

  </div>
</template>
<script>
  import {designOpera} from './api'
  import Design from './Design.vue'
  import DataShow from './DataShow.vue'
  import ElButton from "../../node_modules/element-ui/packages/button/src/button";
  
  export default{
    components:{
      ElButton,
      Design,
     
      DataShow,
    },
    data(){
      return{
        defaultActive:1,//当前激活菜单
        activeName:'hdtj',//标签页当前选择项
        wjList:[],//问卷列表
        loading:false,//是否显示加载中
        
      
        
        interests: ['运动','游戏','音乐','绘画','旅游','摄影','综艺','生活','数码','动画','电视剧','电影'],
        identities: ['技术', '产品', '设计', '运营', '市场', '人事', '金融', '医疗', '采购', '教育', '物流', '律师', '翻译', '生产制造', '其他', '学生'],
        willAddWj:{
          id:0,
          title:'',
          flag:0,
          desc:'感谢您能抽时间参与本次问卷，您的意见和建议就是我们前行的动力！',
          checkedInterests: [],
          checkedIdentities: [],
          ageList: [],
          min_age: 0,
          max_age: 0,
         
        },
        shareInfo:{
          url:'',
        },

      }
    },
    mounted(){
      this.logincheck();

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
            desc:null,
            status:null
          }
        }
        return{
          id:now.id,
          title:now.title,
          desc:now.desc,
          status:now.status
        }
      },
    },
    methods:{
      onInput(){
        this.$forceUpdate();
    },
      addItem () {  // 增加一条年龄比例
      this.willAddWj.ageList.push({
        min_age: 0,
        max_age: 0,
       
        })
      },
      deleteItem (item, index) {  // 删除一条年龄比例
        this.willAddWj.ageList.splice(index, 1)
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
            this.loading=false;
            //获取当前选中问卷题目
            this.lookDetail();
          })
      },
      
      
      //问卷点击
      wjClick(id,index){
        this.defaultActive=(index+1).toString();
        this.lookDetail();
      },
      //查看问卷详情
      lookDetail(){
        
        console.log("id=")
        console.log(this.nowSelect.id)
        this.$refs.dataShow.dataAnalysis(this.nowSelect.id);
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
