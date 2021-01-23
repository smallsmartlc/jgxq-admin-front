<template>
  <div v-if="playerReq" style="padding:30px;">
    <el-form loading="formLoading" ref="editForm" label-position="top" @submit.native.prevent :rules="rules" label-width="80px" :model="playerReq">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="playerReq.name"></el-input>
      </el-form-item>
      <el-form-item label="英文名" prop="enName">
        <el-input v-model="playerReq.enName"></el-input>
      </el-form-item>
      <el-form-item label="国籍" prop="nation">
        <el-input v-model="playerReq.nation"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="headImage">
        <div>
          <el-image style="width: 80px; height: 80px" :src="$utils.url2img(playerReq.headImage)" fit="contain"></el-image>
          <el-link type="primary" @click="imgDialog = true" :underline="false">上传头像</el-link>
        </div>
      </el-form-item>
      <el-form-item label="身高/cm" prop="height">
        <el-input-number v-model="playerReq.height" controls-position="right" :min="0" :max="300"/>
      </el-form-item>
      <el-form-item label="体重/kg" prop="weight">
        <el-input-number v-model="playerReq.weight" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="号码" prop="number">
        <el-input-number v-model="playerReq.number" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="球队">
        <div v-if="playerReq.team">
          <el-image style="width: 80px; height: 80px" :src="$utils.url2img(team.logo)" fit="contain"></el-image>
          <div>{{team.name}}<el-link type="primary" @click="removeTeam" :underline="false">取消选择</el-link></div>
        </div>
        <div v-else>未设置球队</div>
        <div><el-link type="primary" @click="teamDialog = true" :underline="false">选择球队</el-link></div>
      </el-form-item>
      <el-form-item label="惯用脚" prop="strongFoot">
          <el-select v-model="playerReq.strongFoot" placeholder="请选择">
            <el-option
              v-for="item in footStr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="位置" prop="position">
          <el-select v-model="playerReq.position" placeholder="请选择">
            <el-option
              v-for="item in positionStr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
        v-model="playerReq.birthday"
        type="date"
        :picker-options="pickerOptions"
        placeholder="选择日期">
      </el-date-picker>
      </el-form-item>
      <el-form-item label="球员信息">
        <div>
          <div style="width:500px">
            <div style="display:flex;justify-content:space-between">
              <div>基本信息</div>
              <div><el-button @click="addNormalInfo" type="success" size="mini" icon="el-icon-plus" circle></el-button></div>
            </div>
            <div v-if="playerReq.infos.normal">
              <div class="info_box" v-for="(item,index) in playerReq.infos.normal" :key="index" style="display : flex;justify-content:space-between">
                <el-input style="width:200px" v-model="item.name" placeholder="标题" />
                <el-input style="width:200px" v-model="item.value" placeholder="内容" />
                <div class="remove"><el-button @click="removeNormalInfo(index)" type="success" size="mini" icon="el-icon-minus" circle></el-button></div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePlayer">修改</el-button>
        <el-button @click="routeBack">返回</el-button>
      </el-form-item>
    </el-form>
    <img-update @success="changeLogo" imgtype="playerimg" :visible = "imgDialog" @close="closeImgUpdate"/>
    <team-update @close="closeTeam" @success="setTeam" :dialogVisible = "teamDialog"/>
  </div>
</template>
<script>
import { updatePlayer,getPlayerById} from '@/api/player'
import ImgUpdate from '@/components/common/ImgUpdate.vue'
import ChampionBox from '@/components/common/ChampionBox.vue'
import TeamUpdate from '@/components/common/TeamUpdate.vue'

export default {
  components : {ImgUpdate, ChampionBox, TeamUpdate},
  data() {
    return {
      playerReq: null,
      team : {},
      formLoading: true,
      imgDialog : false,
      teamDialog : false,
      rules: {
        name : [{required: true, message: '请输入球队名称', trigger: 'blur'}],
        enName : [{required: true, message: '请输入英文名', trigger: 'blur'}],
        number : [{required: true, message: '请输入号码', trigger: 'blur'}],
        strongFoot : [{required: true, message: '请选择惯用脚', trigger: 'blur'}],
        position : [{required: true, message: '请选择位置', trigger: 'blur'}],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      footStr : [{value:0,label:"右脚"},{value:1,label:"左脚"},{value:2,label:"双脚"}],
      positionStr : [{value:0,label:"门将"},{value:1,label:"后卫"},{value:2,label:"中场"},{value:3,label:"前锋"}],
    }
  },
  mounted() {
    this.fetchdata();
  },
  methods: {
    fetchdata(){
      getPlayerById(this.$route.params.id).then((res)=>{
        if(res.code == 200){
          this.playerReq = res.data
          this.team = this.playerReq.team;
          if(this.team){
            this.playerReq.team = this.team.id
          }
        }
      })
    },
    closeImgUpdate(){
      this.imgDialog = false;
    },
    changeLogo(url){
      this.playerReq.headImage = url;
      this.imgDialog = false;
    },
    addNormalInfo(){
      if(!this.playerReq.infos.normal){
        this.playerReq.infos.normal = [];
      }
      var temp = {name:"",value : ""}
      this.playerReq.infos.normal.push(temp);
    },
    removeNormalInfo(index){
      this.playerReq.infos.normal.splice(index, 1)
    },
    closeTeam(){
      this.teamDialog = false;
    },
    setTeam(item){
      this.team = item;
      this.playerReq.team = item.id
      this.teamDialog = false;
    },
    updatePlayer(){
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          this.formLoading = true;
          updatePlayer(this.$route.params.id,this.playerReq).then((res)=>{
            if(res.code == 200 && res.data){
              this.$message.success("修改成功!");
              this.routeBack();
              this.formLoading = false;
            }
          }).catch(()=>{this.formLoading = false})
        }else{
          this.$message.warning("检查字段是否为空");
        }
      })
    },
    routeBack(){
      this.$router.go(-1);
    },
    removeTeam(){
      this.team = null;
      this.playerReq.team = null;
    }
  }
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
</style>