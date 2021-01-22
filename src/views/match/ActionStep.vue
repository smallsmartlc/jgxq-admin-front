<template>
<div>
<el-button type="text" @click="timeDialog=true">添加事件</el-button>
<el-steps :active="action.length" direction="vertical">
    <el-step v-for="(action,index) in action" :key="index">
        <div slot="icon">{{action.time}}</div>
        <div slot="title" class="bubble">
            <div v-for="(item,index) in action.infoList" :key="index">
                <div>{{item.home?'主队':'客队'}}</div>
                <i :class="actionType[item.type].icon" :style="{'color':actionType[item.type].color}"></i>
                <div>{{item.name}}</div>
            </div>
            <el-button type="text" @click="actionDialog=true"><i class="el-icon-circle-plus-outline"/>事件</el-button>
        </div>
    </el-step>
</el-steps>
<el-dialog width="250px" title="事件发生时间" :visible.sync="timeDialog">
  <el-input-number v-model="time" :min="0" :max="999"></el-input-number>
  <div slot="footer" class="dialog-footer">
    <el-button @click="timeDialog = false">取 消</el-button>
    <el-button type="primary" @click="addTime">确 定</el-button>
  </div>
</el-dialog>
<el-dialog title="添加事件" :visible.sync="actionDialog">
    <el-form :inline="true">
        <el-form-item>
            <el-select v-model="actionInfo.home" placeholder="请选择">
                <el-option label="主队" :value="true"/>
                <el-option label="客队" :value="false"/>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-select v-model="actionInfo.type" value-key="index" placeholder="请选择">
                <el-option v-for="(item,index) in actionType" :key="index" :label="item.name" :value="index">
                    <div>
                        <i :class="item.icon" :style="{'color':item.color}"/>{{item.name}}
                    </div>
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-select v-model="player" value-key="index" filterable placeholder="请选择">
                <el-option
                v-for="(item,index) in select"
                :key="index"
                :label="`${item.name}-${item.number}号`"
                :value="item">
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="actionDialog = false">取 消</el-button>
    <el-button type="primary" @click="addAction">确 定</el-button>
  </div>
</el-dialog>
</div>
<!-- <div v-for="(action,index) in matchReq.action" :key="index">
            <div v-for="(item,index) in action.infoList" :key="index">
                <div class="action_box">
                    <div>{{action.time}}′</div>
                    <div>{{isHome(item.home)}}</div>
                    <div>{{item.name}}</div>
                    <i :class="actionType[item.type].icon" :style="{'color':actionType[item.type].color}"></i>
                </div>
            </div>
        </div> -->
</template>

<script>
export default {
props:{
    action : Array,
    allPlayer : Array,
},
data() {
    return {
        timeDialog : false,
        actionDialog : false,
        actionType:[
        {
          name : "进球",
          color:"#000",
          icon : "iconfont icon-zuqiu",
        },
        {
          name : "点球",
          color:"#fc0",
          icon : "iconfont icon-zuqiu",
        },
        {
          name : "点球不进",
          color:"#FF0000",
          icon : "iconfont icon-zuqiu",
        },
        {
          name : "乌龙球",
          color:"#FF00FF",
          icon : "iconfont icon-zuqiu",
        },
        {
          name : "助攻",
          color:"#666",
          icon : "iconfont icon-zhugong",
        },
        {
          name : "红牌",
          color:"#ea3443",
          icon : "iconfont icon-red-card",
        },
        {
          name : "黄牌",
          color:"#fc0",
          icon : "iconfont icon-red-card",
        },
        {
          name : "换上",
          color:"#fc0",
          icon : "el-icon-top",
        },
        {
          name : "换下",
          color:"#ea3443",
          icon : "el-icon-bottom",
        },
        ],
        time : 0,
        actionInfo : {
            home : true,
            type : 0,
            playerId : null,
            name : "",
        },
        player : {},
    }
},
methods: {
    addTime(){
        this.action.push({time : this.time,infoList : []});
        this.timeDialog = false;
    },
    addAction(){
        this.action.infoList.push()
    }
},
computed:{
    select(){
        var temp = [];
        this.allPlayer.forEach((a,index)=>{
            const{id,name,number} = a;
            temp.push({id,name,number,index});
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
</style>