<template>
  <div v-if="matchReq" style="padding:30px;">
    <el-form loading="formLoading" ref="editForm" label-position="top" @submit.native.prevent :rules="rules" label-width="80px" :model="matchReq">
      <el-form-item label="标题" prop="title">
        <el-input v-model="matchReq.title"></el-input>
      </el-form-item>
      <div style="display:flex">
        <el-form-item label="主队" prop="homeTeam" style="width:40%">
          <div v-if="matchReq.homeTeam">
            <el-image style="width: 80px; height: 80px" :src="$utils.url2img(homeTeam.logo)" fit="contain"></el-image>
            <div>{{homeTeam.name}}</div>
            <div>主队比分<el-input-number size="mini" controls-position="right" v-model="matchReq.homeScore" label="主队比分"/></div>
          </div>
          <div v-else>未设置球队</div>
          <div><el-link type="primary" @click="homeTeamDialog = true" :underline="false">选择球队</el-link></div>
          <team-update @close="homeTeamDialog = false" @success="setHomeTeam" :dialogVisible = "homeTeamDialog"/>
        </el-form-item>
        <el-form-item label="客队" prop="visitingTeam" style="width:40%">
          <div v-if="matchReq.visitingTeam">
            <el-image style="width: 80px; height: 80px" :src="$utils.url2img(visitingTeam.logo)" fit="contain"></el-image>
            <div>{{visitingTeam.name}}</div>
            <div>客队比分<el-input-number size="mini" controls-position="right" v-model="matchReq.visitingScore" label="主队比分"/></div>
          </div>
          <div v-else>未设置球队</div>
          <div><el-link type="primary" @click="visitingTeamDialog = true" :underline="false">选择球队</el-link></div>
          <team-update @close="visitingTeamDialog = false" @success="setVisitingTeam" :dialogVisible = "visitingTeamDialog"/>
        </el-form-item>
      </div>
      <el-form-item label="比赛时间" prop="startTime">
        <el-date-picker
          v-model="matchReq.startTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <div class="squad_container">
        <div>
          <player-transfer label="主队" :team="matchReq.homeTeam" @import="importPlayer(matchReq.homeTeam)" :lineUp="matchReq.matchInfo.homeLineUp" :substitute.sync="matchReq.matchInfo.homeSubstitute"/>
          <player-transfer label="客队" :team="matchReq.visitingTeam" @import="importPlayer(matchReq.visitingTeam)" :lineUp="matchReq.matchInfo.visitingLineUp" :substitute.sync="matchReq.matchInfo.visitingSubstitute"/>
        </div>
        <div style="width:450px">
          <div class="fomations">
            <div class="fomation">
              <div v-for="(item,index) in homeGroup" :key="'home'+index" class="line">
                <div class="player_container" v-for="(player,index2) in item" :key="`home${index}-${index2}`">
                  <div class="player home">{{player.number}}</div>
                  <div style="color:#fff;font-size:14px">{{player.name}}</div>
                </div>
              </div>
            </div>
            <div class="fomation">
              <div v-for="(item,index) in visitingGroup.reverse()" :key="'home'+index" class="line">
                <div class="player_container" v-for="(player,index2) in item" :key="`visit${index}-${index2}`">
                  <div class="player visiting">{{player.number}}</div>
                  <div style="color:#fff;font-size:14px">{{player.name}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-form-item label="事件" class="action_container">
        <action-step :allPlayer = "allPlayer" :action="matchReq.actions"/>
      </el-form-item>
      <el-form-item label="战报新闻">
        <el-autocomplete
          v-model="searchStr"
          style="width:400px"
          class="inline-input"
          :fetch-suggestions="searchNews"
          placeholder="搜索新闻"
          :trigger-on-focus="false"
          @select="selectNews"
          suffix-icon="el-icon-search">
          <template slot-scope="{ item }">
            <news-box width="300px" imgSize="40px" :news="item"/>
          </template>
        </el-autocomplete>
        <div style="background-color:#F2F6FC;width:50%"><news-box width="100%" imgSize="60px"  v-if="matchNews" :news="matchNews"/></div>
      </el-form-item>
      <el-form-item label="视频链接" prop="link">
        <el-input v-model="matchReq.link"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editMatch">修改</el-button>
        <el-button @click="routeBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {updateMatch,getMatchById} from '@/api/match'
import {searchNews} from '@/api/news'
import ImgUpdate from '@/components/common/ImgUpdate.vue'
import ChampionBox from '@/components/common/ChampionBox.vue'
import TeamUpdate from '@/components/common/TeamUpdate.vue'
import PlayerTransfer from './PlayerTransfer.vue'
import ActionStep from './ActionStep.vue'
import NewsBox from './NewsBox.vue'

export default {
  components : {ImgUpdate, ChampionBox, TeamUpdate, PlayerTransfer, ActionStep, NewsBox},
  data() {
    return {
      matchReq: null,
      homeTeam : null,
      visitingTeam : null,
      matchNews : null,
      formLoading: true,
      homeTeamDialog : false,
      visitingTeamDialog : false,
      rules: {
        title : [{required: true, message: '请输入标题', trigger: 'blur'}],
        homeTeam : [{required: true, message: '请选择主队', trigger: 'blur'}],
        visitingTeam : [{required: true, message: '请选择客队', trigger: 'blur'}],
        startTime : [{required: true, message: '必须选择比赛时间!', trigger: 'blur'}],
      },
      searchStr : "",
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData(){
      getMatchById(this.$route.params.id).then((res)=>{
        if(res.code == 200 && res.data){
          let data = res.data;
          this.matchNews = data.matchNews;
          this.homeTeam = data.homeTeam;
          this.visitingTeam = data.visitingTeam;
          data.homeTeam = data.homeTeam?data.homeTeam.id:null;
          data.visitingTeam = data.visitingTeam?data.visitingTeam.id:null;
          data.matchNews = data.matchNews?data.matchNews.id:null;
          this.matchReq = data;
        }
      })
    },
    setHomeTeam(item){
      this.homeTeam = item;
      this.matchReq.homeTeam = item.id
      this.homeTeamDialog = false;
    },
    setVisitingTeam(item){
      this.visitingTeam = item;
      this.matchReq.visitingTeam = item.id
      this.visitingTeamDialog = false;
    },
    editMatch(){
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          this.formLoading = true;
          updateMatch(this.$route.params.id,this.matchReq).then((res)=>{
            if(res.code == 200 && res.data){
              this.$message.success("修改成功!");
              this.routeBack();
            }
            this.formLoading = false;
          }).catch(()=>{this.formLoading = false})
        }else{
          this.$message.warning("检查字段是否为空");
        }
      })
    },
    routeBack(){
      this.$router.go(-1);
    },
    searchNews(queryString, cb) {
      searchNews(queryString).then((res)=>{
        if(res.code==200){
          cb(res.data);
        }
      })
    },
    selectNews(item){
      this.matchReq.matchNews = item.id;
      this.matchNews = item;
    }
  },
  computed: {
    homeGroup(){
      var newArr = [];
      if(!this.matchReq.matchInfo.homeLineUp) return;
      this.matchReq.matchInfo.homeLineUp.forEach(e => {
          if(!newArr[e.matchPos]){
              newArr[e.matchPos] = [];
          }
          newArr[e.matchPos].push(e);
      });
      return newArr;
    },
    visitingGroup(){
      var newArr = [];
      if(!this.matchReq.matchInfo.visitingLineUp) return;
      this.matchReq.matchInfo.visitingLineUp.forEach(e => {
          if(!newArr[e.matchPos]){
              newArr[e.matchPos] = [];
          }
          newArr[e.matchPos].push(e);
      });
      return newArr;
    },
    allPlayer(){
      return this.matchReq.matchInfo.homeLineUp.concat(this.matchReq.matchInfo.homeSubstitute).concat(this.matchReq.matchInfo.visitingLineUp).concat(this.matchReq.matchInfo.visitingSubstitute);
    }
  },
}
</script>
<style scoped>
.info_box .remove{
  visibility:hidden;
}
.info_box:hover .remove{
  visibility: visible;
  transition : 1s;
}
.squad_container{
  display: flex;
  justify-content: space-between;
}
.player_container{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40px;
}
.player_container div{
    white-space: nowrap; 
}
.row{
    display: flex;
    align-items: center;
    padding: 20px;
    border: 1px solid #E6E4DC;
    font-size: 20px;
}
.col{
    width:50%;
}
.home{
    border: 2px solid #000;
    background-color: red;
}
.visiting{
    border: 2px solid red;
    background-color: #191970;
}
.player{
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #fff;
    font-size: 20px;
    border-radius: 50%;
}
.line{
    display: flex;
    justify-content: space-around;  
}
.fomation{
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.fomations{
  height: 600px;
  background:  url("../../assets/playground.jpg") no-repeat;
  background-size: 100% 100%; 
}
.action_box{
    display: flex;
    font-size: 18px;
    line-height:40px
}

</style>
<style>
.el-picker-panel__footer .el-button--text.el-picker-panel__link-btn {
  display: none;
}
</style>