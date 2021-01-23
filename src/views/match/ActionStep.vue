<template>
<div>
<el-button type="text" @click="timeDialog=true">添加事件</el-button>
<el-steps class="action_step" :active="999"  direction="vertical">
    <el-step v-for="(action,index) in action" :key="index">
        <div slot="icon">{{action.time}}</div>
        <div slot="title" class="action_box" style="display:flex;align-items:center">
            <div class="bubble">
                <action-list :list="action.infoList" :players="select"/>
            </div>
            <el-button class="hover_btn" style="margin-left:4px" type="primary" @click="removeAction(index)" icon="el-icon-minus" size="mini" circle/>
        </div>
    </el-step>
    <el-step icon="el-icon-time"><div slot="title" style="height:40px"></div></el-step>
</el-steps>
<el-dialog width="250px" title="事件发生时间" :visible.sync="timeDialog">
  <el-input-number v-model="time" :min="0" :max="999"></el-input-number>
  <div slot="footer" class="dialog-footer">
    <el-button @click="timeDialog = false">取 消</el-button>
    <el-button type="primary" @click="addTime">确 定</el-button>
  </div>
</el-dialog>
</div>

</template>

<script>
import ActionList from './ActionList.vue';
export default {
  components: { ActionList },
props:{
    action : Array,
    allPlayer : Array,
},
data() {
    return {
        timeDialog : false,
        time : 0,
    }
},
methods: {
    addTime(){
        this.action.push({time : this.time,infoList : []});
        // this.action.unshift({time : this.time,infoList : []});
        this.timeDialog = false;
    },
    removeAction(index){
        this.action.splice(index,1);
    }
},
computed:{
    select(){
        var temp = [];
        this.allPlayer.forEach((a,index)=>{
            temp.push({id:a.id,name:a.name,number:a.number,index});
        })
        return temp;
    }
}
}
</script>

<style scoped>
.bubble{
    background-color: #F2F6FC;
    width: 200px;
    min-height: 60px;
    border-radius: 10px;
    padding: 5px;
}
.action_box .hover_btn{
    visibility: hidden;
}
.action_box:hover .hover_btn{
    visibility: visible;
}
</style>
<style>
    .action_step .el-step__line{
        /* background-color:#409EFF; */
    }
    .action_step .el-step__icon{
        position: absolute;
    }
</style>