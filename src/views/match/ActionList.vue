<template>
  <div>
    <draggable class="list" :list="list">
      <div style="display:flex;cursor:pointer;" v-for="(item,index) in list" :key="index">
          <div>{{item.home?'主队':'客队'}}</div>
          <i :class="actionType[item.type].icon" :style="{'color':actionType[item.type].color}"></i>
          <div>{{item.name}}</div>
          <div><el-link type="primary" @click="removerAction(index)" :underline="false"><i class="el-icon-remove-outline"></i></el-link></div>
      </div>
    </draggable>
    <el-button type="text" @click="actionDialog=true"><i class="el-icon-circle-plus-outline"/>事件</el-button>
    <el-dialog title="添加事件" :visible.sync="actionDialog">
        <el-form :inline="true">
            <el-form-item>
                <el-select v-model="home" placeholder="请选择">
                    <el-option label="主队" :value="true"/>
                    <el-option label="客队" :value="false"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="type" value-key="index" placeholder="请选择">
                    <el-option v-for="(item,index) in actionType" :key="index" :label="item.name" :value="index">
                        <div>
                            <i :class="item.icon" :style="{'color':item.color}"/>
                            {{item.name}}
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="player" value-key="index" filterable placeholder="请选择">
                    <el-option
                    v-for="(item,index) in players"
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
</template>

<script>
import draggable from 'vuedraggable'
export default {
components:{draggable},
props:{
    list:Array,
    players : Array,
},
data() {
    return {
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
          icon : "iconfont icon-shang",
        },
        {
          name : "换下",
          color:"#ea3443",
          icon : "iconfont icon-xia",
        },
        ],
        actionDialog : false,
        player : {},
        home : true,
        type : 0,
    }
},
methods: {
    addAction(){
        this.list.push({name:this.player.name,playerId:this.player.playerId,home:this.home,type:this.type});
        this.actionDialog = false;
    },
    removerAction(index){
      this.list.splice(index,1);
    }
},
}
</script>

<style>

</style>