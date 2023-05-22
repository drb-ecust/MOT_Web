<template>
    <div class="wrapper">

        <el-row  >
            
                    <el-col :span="6"><el-calendar v-model="value">
                      </el-calendar></el-col>
                    <el-col :span="12"  >
                    
                     
                    
                        
                       
                        <!-- <el-card class="box-card wj" v-for="count in data.length" :key="count" style="margin:10px 10px" >
                        
                        <div slot="header" class="clearfix">
                          <span>订单{{data[count-1]["id"]}}</span>
                          <el-button style="float: right; padding: 3px 0" type="text" v-if="data[count-1]['status']<0.5" @click="sd(data[count-1]['id'])">送达</el-button>
                          <span style="float: right; padding: 3px 0" v-if="data[count-1]['status']>0.5">已送达</span>
                        </div>
                        
                        <div class="text item">店铺名称:{{data[count-1]["restname"]}}</div>
                      
                        <div class="text item">目的地:{{data[count-1]["loc"]}}</div>
                        <div style="margin:1px 1px">
                          <div  v-for="dish in data[count-1]['dishes']"  v-if="dish['num']>0">
                            <div class="text item" style="margin:1px 1px">菜品名：{{dish['dishname']}}</div>
                            <div class="text item" style="margin:1px 1px">菜品数量：{{dish['num']}}</div>
                          </div>
                        </div>


                        <div class="text item" style="margin:10px 10px">总价:{{data[count-1]["total"]}}元</div>
                   
                        
                      </el-card> -->
                    </el-col>
                    
                  
                    
        </el-row>
        
    </div>
  
</template>

<script>
import { designOpera } from './api';
export default {
    data(){
        return{
            aa:[1,2,3,4,5,6,7,8],
            data: [],
            value: new Date(),
            user_identity: '',
            user_interest: [],
            user_points: 0,
            user_age : 0,
            super_data:[],

        }
    },
    methods:{
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
            console.log(data);
            sessionStorage.setItem('username',data.data.user); //将后端传的username存入session
            
          }
        })
      },
      sd(id){
        var username = sessionStorage.getItem('username');
        designOpera({
          opera_type:'sd',
          username: username,
          orderid: id
        }).then(data=>{
          console.log(data)
          location.reload()
        })

      }
    },
    mounted(){
      
      this.logincheck();
  
    
      var username = sessionStorage.getItem('username');
      designOpera({
        opera_type:'get_order_list',
        username: username,
        
      }).then(data=>{
          console.log(data);
          if(data.code==0){
            this.data = data.data.detail;
            
            console.log("data");
            console.log(data);
            
          }
          else{
            this.$message({
              type: 'error',
              message: data.msg
            });
          }
        })
    }

}
</script>
<style scoped>

  

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 200px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 600px;
    
  }
  .wj{
    position: relative;
    left:10%;
  }
  .person{
    width:400px
  }
a {
    text-decoration: none;
    color:#409EFF;
}
/*正常的未被访问过的链接*/
a:link {
    text-decoration: none;
}
/*已经访问过的链接*/
a:visited {
    text-decoration: none;
}
/*鼠标划过(停留)的链接*/
a:hover {
    text-decoration: none;
}
/* 正在点击的链接*/
a:active {
    text-decoration: none;
}
</style>