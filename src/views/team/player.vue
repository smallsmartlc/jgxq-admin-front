<template>
  <div class="app-container">
    <div style="display:flex;justify-content:space-between">
      <div class="left" style="margin-bottom:10px;display:flex">
        <router-link to="/player"><el-button type="primary" size="small" icon="el-icon-plus">添加队员</el-button></router-link>
        <el-upload
          ref="fileUpload"
          class="upload-demo"
          :action="uploadUrl"
          :multiple="false"
          with-credentials
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :limit="1"
          style="margin: 0 16px"
          >
          <el-button @click="clearFiles" size="small" type="success">从Excel导入</el-button>
          <span style="margin-left:8px" slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</span>
        </el-upload>
        <el-button type="primary" @click="spiderDialog=true" size="small" icon="el-icon-plus">从ing足球导入</el-button>
        <el-dialog title="输入比赛id" :visible.sync="spiderDialog" width="30%">
          <import-ing></import-ing>
        </el-dialog>
      </div>
      <div class="right" style="display:flex">
        <div>
          <el-button type="info" @click="editDialog=true">合同到期</el-button>
        </div>
      </div>
    </div>
    <div v-for="(item,index) in playerGroup" :key="item.name">
      <template v-if="item.length>0">
        <h3>{{position[index]}}</h3>
        <div>
          <el-table
          :data="item"
          border
          :show-header="false"
          style="width: 100%">
            <el-table-column
              label="id">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column
              label="姓名">
              <template slot-scope="scope">
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column
              label="头像">
              <template slot-scope="scope">
                <el-image style="width: 80px; height: 80px" :src="$utils.url2img(scope.row.headImage)" fit="contain"></el-image>
              </template>
            </el-table-column>
            <el-table-column
              label="国籍">
              <template slot-scope="scope">
                {{scope.row.nation}}
              </template>
            </el-table-column>
            <el-table-column
              label="号码">
              <template slot-scope="scope">
                {{scope.row.number}}号
              </template>
            </el-table-column>
            <el-table-column
              label="号码">
              <template slot-scope="scope">
                <router-link :to="`/player/${scope.row.id}`"><el-link type="primary" :underline="false">编辑</el-link></router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      
    </div>
    <el-dialog title="合同到期球员" :visible.sync="editDialog" width="30%">
      <div v-loading="dialogLoading">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="data" @change="handleCheckedPlayersChange">
          <el-checkbox :label="item.id" v-for="(item,index) in list" :key="index" border>
            <div style="display:flex;flex-wrap:wrap;align-items:center">
                <div class="circle">{{item.number}}</div>
                <div>{{item.name}}</div>
                <div style="font-size:12px">{{position[item.matchPos]}}</div>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog=false">取 消</el-button>
        <el-button type="primary" @click="batchRetire">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTeamMembers,batchRetire } from '@/api/player'
import { BaseUrl } from '@/constants/index'
import ImportIng from './ImportIng.vue'
export default {
  components: { ImportIng,  },
  data() {
    return {
      list : null,
      listLoading: true,
      position : ["门将","后卫","中场","前锋"],
      curIndex : 0,
      editDialog : false,
      isIndeterminate : false,
      data: [],
      checkAll : false,
      dialogLoading : false,
      spiderDialog : false,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getTeamMembers(this.$route.params.id).then(res => {
        if(res.code == 200){
          this.list = res.data;
          this.listLoading = false
        }
      }).catch(()=>{this.listLoading = false})
    },
    batchRetire(){
      if(this.data == null || this.data.length<1){
        this.$message.warning("必须选择队员！！！");
        return;
      }
      this.dialogLoading = true;
      batchRetire({teamId:this.$route.params.id,playerIdList:this.data}).then(res => {
        if(res.code == 200){
          if(res.data){
            this.$message.success("已将队员移出阵容");
            this.list = this.list.filter(item=>!this.data.includes(item.id));
            this.data = [];
          }else{
            this.$message.success("球员不存在!");
          }
        }
      }).finally(()=>{this.dialogLoading = false})
    },
    handleCheckAllChange(val){
      this.data = val ? this.list : [];
      this.isIndeterminate = false;
    },
    handleCheckedPlayersChange(val){
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.list.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
    },
    handleUploadSuccess(res){
      if(res.code == "200"){
        this.$message.success(`已添加${res.data}名球员,姓名相同球员需要手动添加`);
        if(res.data > 0){
          this.fetchData();
        }
      }
    },
    handleUploadError(error){
      if(error.status){
        if(error.status === 401){
          this.$message.error("请先登陆再操作");
        }else if(error.status === 403){
          let res = JSON.parse(error.message);
          this.$message.warning(res.message||'没有操作权限！');
        }else if(error.status === 500 || error.status == 400){
          let res = JSON.parse(error.message);
          this.$message.error(res.message || '服务器异常，请联系管理员')
        }
      }else{
        this.$message.error(error.message|| '服务器异常，请联系管理员')
      }
    },
    clearFiles(){
      this.$refs.fileUpload.clearFiles()
    },
  },
  computed:{
    playerGroup(){
      let res = [[],[],[],[]];
      var list = this.list?this.list:[];
      for(var i=0;i<list.length;i++){
        res[list[i].position].push(list[i]);
      }
      return res;
    },
    uploadUrl(){
      return BaseUrl + `/player/upload/${this.$route.params.id}`
    }
  }
}
</script>