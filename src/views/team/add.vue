<template>
  <div v-if="teamReq" style="padding:30px;">
    <el-form loading="formLoading" ref="addForm" label-position="top" @submit.native.prevent :rules="rules" label-width="80px" :model="teamReq">
      <el-form-item label="球队名" prop="name">
        <el-input v-model="teamReq.name"></el-input>
      </el-form-item>
      <el-form-item label="英文名" prop="enName">
        <el-input v-model="teamReq.enName"></el-input>
      </el-form-item>
      <el-form-item label="队徽" prop="logo">
        <div>
          <el-image style="width: 80px; height: 80px" :src="$utils.url2img(teamReq.logo)" fit="contain"></el-image>
          <el-link type="primary" @click="imgDialog = true" :underline="false">添加队徽</el-link></div>
      </el-form-item>
      <el-form-item label="球队信息">
        <div>
          <div style="width:500px">
            <div style="display:flex;justify-content:space-between">
              <div>基本信息</div>
              <div><el-button @click="addNormalInfo" type="success" size="mini" icon="el-icon-plus" circle></el-button></div>
            </div>
            <div v-if="teamReq.infos.normal">
              <div class="info_box" v-for="(item,index) in teamReq.infos.normal" :key="index" style="display : flex;justify-content:space-between">
                <el-input style="width:200px" v-model="item.name" placeholder="标题" />
                <el-input style="width:200px" v-model="item.value" placeholder="内容" />
                <div class="remove"><el-button @click="removeNormalInfo(index)" type="success" size="mini" icon="el-icon-minus" circle></el-button></div>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between">
              <div>联系方式</div>
              <div><el-button @click="addContactInfo" type="success" size="mini" icon="el-icon-plus" circle></el-button></div>
            </div>
            <div v-if="teamReq.infos.contact">
              <div class="info_box" v-for="(item,index) in teamReq.infos.contact" :key="index" style="display : flex;justify-content:space-between">
                <el-input style="width:200px" v-model="item.name" placeholder="标题" />
                <el-input style="width:200px" v-model="item.value" placeholder="内容" />
                <div class="remove"><el-button @click="removeContactInfo(index)" type="success" size="mini" icon="el-icon-minus" circle></el-button></div>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between">
              <div>荣誉</div>
              <div><el-button @click="addChampionInfo" type="success" size="mini" icon="el-icon-plus" circle></el-button></div>
            </div>
            <div v-if="teamReq.infos.champions">
              <div class="info_box" v-for="(item,index) in teamReq.infos.champions" :key="index" style="display:flex;justify-content:space-between">
                <el-input style="width:200px" v-model="item.name" placeholder="冠军名" />
                <champion-box :time="item.time" />
                <div class="remove"><el-button @click="removeChampionInfo(index)" type="success" size="mini" icon="el-icon-minus" circle></el-button></div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addTeam">添加</el-button>
        <el-button @click="routeBack">返回</el-button>
      </el-form-item>
    </el-form>
    <img-update @success="changeLogo" imgtype="headimg" :visible = "imgDialog" @close="closeImgUpdate"/>
  </div>
</template>
<script>
import { getTeam,addTeam} from '@/api/team'
import ImgUpdate from '@/components/common/ImgUpdate.vue'
import ChampionBox from '@/components/common/ChampionBox.vue'

export default {
  components : {ImgUpdate, ChampionBox},
  data() {
    return {
      teamReq: {
        name : null,
        enName : null,
        logo : null,
        infos : {
          normal : [
            {
              name : "成立时间",
              value : null,
            },
            {
              name : "所在地区",
              value : null,
            },
            {
              name : "球队主场",
              value : null,
            },
          ],
          contact : [
            {
              name : "地址",
              value : null,
            },
            {
              name : "email",
              value : null,
            },
            {
              name : "qq",
              value : null,
            },
          ],
          champions : []
        }
      },
      formLoading: true,
      imgDialog : false,
      rules: {
        name : [{required: true, message: '请输入球队名称', trigger: 'blur'}],
        enName : [{required: true, message: '请输入英文名', trigger: 'blur'}],
        logo : [{required: true, message: '必须上传队徽', trigger: 'blur'}],
      }
    }
  },
  mounted() {
  },
  methods: {
    closeImgUpdate(){
      this.imgDialog = false;
    },
    changeLogo(url){
      this.teamReq.logo = url;
      this.imgDialog = false;
    },
    addNormalInfo(){
      if(!this.teamReq.infos.normal){
        this.teamReq.infos.normal = [];
      }
      var temp = {name:"",value : ""}
      this.teamReq.infos.normal.push(temp);
    },
    removeNormalInfo(index){
      this.teamReq.infos.normal.splice(index, 1)
    },
    addContactInfo(){
      if(!this.teamReq.infos.contact){
        this.teamReq.infos.contact = [];
      }
      var temp = {name:"",value : ""}
      this.teamReq.infos.contact.push(temp);
    },
    removeContactInfo(index){
      this.teamReq.infos.contact.splice(index, 1)
    },
    addChampionInfo(){
      if(!this.teamReq.infos.champions){
        this.teamReq.infos.champions = [];
      }
      var temp = {name:"",time : []}
      this.teamReq.infos.champions.push(temp);
    },
    removeChampionInfo(index){
      this.teamReq.infos.champions.splice(index, 1)
    },
    addTeam(){
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          this.formLoading = true;
          addTeam(this.teamReq).then((res)=>{
            if(res.code == 200){
              this.$message.success("添加成功!");
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