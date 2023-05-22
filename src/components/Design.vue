<!--
程序名：问题设计页面
功能：对问卷中问题的添加、编辑、删除
-->
<template>
  <div class="Design">
    <!-- <img src="" alt=""> -->
    <!-- <iframe src="http://127.0.0.1:5000" frameborder="0"></iframe> -->
    <div ref="chartColumn" style="width:1036px; height:400px;">

    </div>
  </div>
</template>
<script>

  import {designOpera} from './api';
  import * as echarts from 'echarts';
  export default{
    data(){
      return{
        loading:false,//页面加载中
        dialogShow:false,
        dialogTitle:'',
        detail:[],
        wjId:0,
        title:'',
        desc:'',
        willAddQuestion:{
          id:0,
          type:'',
          title:'',
          must:false,//是否必填
          desc:'',
          price: 0.0
        },
        allType:[
          
        ],
        option : {
  title: {
    text: '流量分析'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Car', 'Pedestrain', 'Cyclist', 'Combine']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['10', '20', '30', '40', '50', '60', '70']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Car',
      type: 'line',
      stack: 'Total',
      data: [5, 10, 17, 30, 35, 44, 60]
    },
    {
      name: 'Pedestrain',
      type: 'line',
      stack: 'Total',
      data: [0, 1, 1, 4, 7, 8, 10]
    },
    {
      name: 'Cyclist',
      type: 'line',
      stack: 'Total',
      data: [0, 0, 1, 3, 3, 3, 4]
    },
    {
      name: 'Combine',
      type: 'line',
      stack: 'Total',
      data: [5, 11, 19, 37, 45, 55, 74]
    }
  ]
}
      }
    },
    mounted(){
      this.chart();
    },
    methods:{
      chart(){
        

        this.chartColumn = echarts.init(this.$refs.chartColumn)
        this.chartColumn.setOption(this.option)

        
      },
      //初始化问卷所有问题
      init(wjId,title,desc){
        this.wjId=wjId;
        this.title=title;
        this.desc=desc;
        this.getQuestionList();
      },
      //获取问题列表(问卷内容)
      getQuestionList(){
        this.detail=[];
        this.loading=true;
        designOpera({
          opera_type:'get_question_list',
          username:'test',
          wjId:this.wjId,
        })
          .then(data=>{
            console.log(data);
            this.detail=data.detail;
            this.allType=data.typelist;
            this.loading=false;
          })
      },
      //点击添加问题按钮
      addQuestion(){
        if(this.wjId==0||this.wjId==null){
          this.$message({
            type: 'error',
            message: '清先创建问卷!'
          });
          return;
        }
        this.dialogTitle='添加题目';
        this.willAddQuestion={
          id:0,
          type:'',
          title:'',
          must:false,//是否必填
          desc:'',
          price: 0.0
        };
        this.dialogShow=true;
      },
      //删除问题
      deleteQuestion(index){
        this.$confirm('确定删除此题目?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          designOpera({
            opera_type:'delete_question',
            username:'test',
            questionId:this.detail[index].id,
          })
            .then(data=>{
              console.log(data);
              if(data.code==0){
                this.detail.splice(index,1);
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
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
      //确认添加/保存题目
      checkAddQuestion(){
        //添加保存问题
        let newItem={};//新添加的问题对象
        newItem={
          type:this.willAddQuestion.type,
          title:this.willAddQuestion.title,
          desc:this.willAddQuestion.desc,
          price:this.willAddQuestion.price,
          must:this.willAddQuestion.must,
        };
        
        designOpera({
          opera_type:'add_question',
          username:'test',
          wjId:this.wjId,
          questionId:this.willAddQuestion.id,
          title:this.willAddQuestion.title,
          type:this.willAddQuestion.type,
          desc:this.willAddQuestion.desc,
          price:this.willAddQuestion.price,
          must:this.willAddQuestion.must,

        })
          .then(data=>{
            console.log(data);
            newItem.id=data.id;
            if(data.code==0){
              this.dialogShow=false;
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.getQuestionList();
            }
            else{
              this.dialogShow=false;
              this.$message({
                type: 'error',
                message: data.msg
              });
            }
            this.willAddQuestion={
              id:0,
          type:'',
          title:'',
          must:false,//是否必填
          desc:'',
          price: 0.0
            };
          });
      },
      //点击编辑问题按钮
      editorQuestion(item){
        this.willAddQuestion.title=item.title;
        this.willAddQuestion.type=item.type;
        
        this.willAddQuestion.desc=item.desc;
        this.willAddQuestion.must=item.must;
        this.willAddQuestion.id=item.id;
        this.willAddQuestion.price=item.price;
        this.dialogTitle='编辑问题';
        this.dialogShow=true;
      },
      //添加选项
      addOption(){
        this.willAddQuestion.options.push({
          title:'',
          id:0,
        });
      },
      //删除选项
      deleteOption(index){
        this.willAddQuestion.options.splice(index,1);
      },
      //切换问题类型
      typeChange(value){
        console.log(value);
        this.willAddQuestion.type=value;
        this.willAddQuestion.text='';
        this.row=1;
      },
    }
  }
</script>
<style scoped>
  .Design{

  }
  .Design .dialog{
    text-align: left;
  }
  .Design .questionTitle{
    display: inline-block;
    width: 80%;
    font-size: 16px;
    color: #303133;
  }
  .Design .addOptionButton{
    display: inline-block;
    margin-left: 80px;
  }
  .box-card{
    width: 100%;
    text-align: left;
  }
  .Design .top{
    color: #606266;
    margin-left: 20px;
    padding: 0 10px 10px 10px;
    border-bottom: 3px solid #409EFF;
    font-size: 15px;
    line-height: 22px;
    text-align: left;
  }
</style>
