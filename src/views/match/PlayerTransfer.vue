<template>
<div>
    <div>
        <b>{{label}}阵容</b>
        <div style="display:flex;justify-content:space-between;margin:10px">
            <el-autocomplete
                v-model="homeKeyword"
                :fetch-suggestions="searchPlayer"
                placeholder="搜索球员"
                suffix-icon="el-icon-search"
                :trigger-on-focus="false"
                size="small"
                @select="selectHomePlayer">
                <template slot-scope="{ item }">
                <div><img :src="$utils.url2img(item.headImage)" style="height:16px;vertical-align: middle;"><span style="font-size:12px">{{item.number}}号&nbsp;{{item.name}}-{{positionMap[item.matchPos]}}</span></div>
                <!-- <span class="addr">{{ item.address }}</span> -->
                </template>
            </el-autocomplete>
            <div>
                <el-button type="primary" icon="el-icon-plus" size="small" @click="openImport" round>从球队导入</el-button>
                <el-button type="primary" icon="el-icon-plus" size="small" @click="addDialog=true" round>自定义球员</el-button>
            </div>
        </div>
        <div style="display:flex">
            <el-form-item :label="`${label}首发`" style="margin-right:20px">
                <div class="box" tabindex="0">
                    <el-scrollbar style="height:100%">
                        <!-- <div v-for="(item,index) in homeGroup" :key="index">
                            <div style="font-size:12px" v-if="item">{{positionMap[index]}}</div> -->
                            <draggable style="padding-bottom:50px" :group="label" class="list" :list="lineUp">
                                <div class="player_box" v-for="(player,i) in lineUp" :key="i">
                                    <div style="display:flex;flex-wrap:wrap;align-items:center">
                                        <div class="circle">{{player.number}}</div>
                                        <div>{{player.name}}</div>
                                        <div style="font-size:12px">{{positionMap[player.matchPos]}}</div>
                                    </div>
                                    <div style="min-width:74px">
                                        <el-button type="primary" class="hover_bt" @click="editPlayer(player)" size="small" icon="el-icon-edit" circle/>
                                        <el-button type="primary" class="hover_bt" @click="toSubstitute(player)" size="small" icon="el-icon-arrow-right" circle/>
                                    </div>
                                </div>
                            </draggable>
                        <!-- </div> -->
                    </el-scrollbar>
                </div>
            </el-form-item>
            <el-form-item :label="`${label}替补`">
                <div class="box" tabindex="0">
                    <el-scrollbar style="height:100%">
                        <draggable style="padding-bottom:50px" :group="label" class="list" :list="substitute">
                            <div class="player_box" v-for="(player,index) in substitute" :key="index">
                                <div style="display:flex;flex-wrap:wrap;align-items:center">
                                    <div class="circle">{{player.number}}</div>
                                    <div>{{player.name}}</div>
                                    <div style="font-size:12px">{{positionMap[player.matchPos]}}</div>
                                </div>
                                <el-button type="primary" class="hover_bt" @click="toLineUp(index)" size="small" icon="el-icon-arrow-left" circle/>
                                <el-button type="primary" class="hover_bt" @click="editPlayer(player)" size="small" icon="el-icon-edit" circle/>
                                <el-button type="danger" class="hover_bt" @click="removeSub(index)" size="small" icon="el-icon-delete" circle/>
                            </div>
                        </draggable>
                    </el-scrollbar>
                </div>
            </el-form-item>
        </div>
    </div>
    <import-player :players="players" :importDialog="importDialog" @submit="importPlayer" @close="closeImport"/>
    <custom-player :addDialog="addDialog" @success="addPlayer" @close="closeAdd"/>
    <edit-player :editDialog="editDialog" :item="item" @close="closeEdit"/>
</div>
</template>

<script>
import CustomPlayer from './CustomPlayer.vue';
import EditPlayer from './EditPlayer.vue';
import ImportPlayer from './ImportPlayer.vue';
import { getMatchTeamMembers,searchPlayer} from '@/api/player'
import draggable from 'vuedraggable'
export default {
  components: { CustomPlayer, EditPlayer, ImportPlayer,draggable },
props : {
    lineUp : Array,
    substitute : Array,
    label : String,
    team : Number,
},
data() {
    return {
        positionMap : ["门将","后卫","中场","前腰","前锋"],
        homeKeyword : "",
        visitingKeyword : "",
        addDialog :false,
        editDialog :false,
        importDialog :false,
        item : null,
        players : [],//用于导入球队中的球员
    }
},
methods: {
    selectHomePlayer(item){
      var temp = {};
      temp.playerId = item.id;
      temp.name = item.name;
      temp.number = item.number;
      temp.matchPos = item.matchPos;
      this.substitute.push(temp);
    },
    searchPlayer(queryString, cb){
      searchPlayer(queryString).then((res)=>{
          if(res.code == 200){
            cb(res.data);
          }
      })
    },
    addPlayer(item){
        this.substitute.push(item);
    },
    editPlayer(item){
        this.item = item;
        this.editDialog = true;
    },
    removeSub(index){
        this.substitute.splice(index,1)
    },
    toLineUp(index){
        this.lineUp.push(this.substitute[index]);
        this.removeSub(index);
    },
    toSubstitute(player){
        this.substitute.push(player);
        this.lineUp.splice(this.lineUp.indexOf(player),1);
    },
    closeAdd(){
        this.addDialog = false;
    },
    closeEdit(){
        this.editDialog = false;
    },
    closeImport(){
        this.importDialog = false;
    },
    importPlayer(players){
        players.forEach(p=>{
            var temp = {};
            temp.playerId = p.id;
            temp.name = p.name;
            temp.number = p.number;
            temp.matchPos = p.matchPos;
            this.substitute.push(temp);
        })
        this.closeImport();
    },
    openImport(){
        if(!this.team){
            this.$message.warning("还没有选择球队!")
            return;
        }
        getMatchTeamMembers(this.team).then((res)=>{
            if(res.code == 200){
                this.players = res.data;
            }
        })
        this.importDialog = true;
    },
},
computed:{
    homeGroup(){
      var newArr = [];
      if(!this.lineUp) return;
      this.lineUp.forEach(e => {
          if(!newArr[e.matchPos]){
              newArr[e.matchPos] = [];
          }
          newArr[e.matchPos].push(e);
      });
      return newArr;
    },
}

}
</script>

<style scoped>
.squad_container .box{
  border: 1px solid #DCDFE6;;
  padding: 5px;
  border-radius: 4px;
  width: 240px;
  height:300px;
  /* overflow: auto; */
}
.squad_container .box:focus{
    border-color: #409EFF;
}
.player_box{
    min-height:40px;
    padding: 5px;
    background-color: #f4f7fb;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.player_box .hover_bt{
    visibility: hidden;
}
.player_box:hover .hover_bt{
    visibility: visible;
}
.circle{
    border-radius: 50%;
    background-color: #409EFF;
    color: #fff;
    text-align: center;
    line-height: 30px;
    width: 30px;
    height: 30px;
    margin-right: 4px;
    cursor: pointer;
}
</style>
<style>
.el-scrollbar__bar{
    overflow-x: hidden !important;
}
</style>