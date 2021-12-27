<template>
  <div class="app-container">
    <div style="display:flex;justify-content:space-between">
      <div class="left" style="margin-bottom:10px"><router-link to="/player"><el-button type="primary" icon="el-icon-plus">添加队员</el-button></router-link></div>
      <div class="right"><el-button type="info" @click="editDialog=true">合同到期</el-button></div>
    </div>
    
    <div v-for="(item,index) in playerGroup" :key="item.name">
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
      
    </div>
    <el-dialog title="合同到期球员" :visible.sync="editDialog" width="30%">
      <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="list" @change="handleCheckedPlayersChange">
        <el-checkbox :label="item" v-for="(item,index) in list" :key="index" border>
            <div style="display:flex;flex-wrap:wrap;align-items:center">
                <div class="circle">{{item.number}}</div>
                <div>{{item.name}}</div>
                <div style="font-size:12px">{{positionMap[item.matchPos]}}</div>
            </div>
        </el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="importPlayer">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { getTeamMembers } from '@/api/player'

export default {
  data() {
    return {
      list : null,
      listLoading: true,
      position : ["门将","后卫","中场","前锋"],
      curIndex : 0,
      editDialog : false,
      isIndeterminate : false,
      data: [],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getTeamMembers(this.$route.params.id).then(res => {
        if(res.code == 200){
          this.list = res.data;
          this.listLoading = false
        }
      }).catch(()=>{this.listLoading = false})
    },
    handleCheckAllChange(val){
      this.data = val ? this.list : [];
      this.isIndeterminate = false;
    },
    handleCheckedPlayersChange(val){
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.players.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
    }
  },
  computed:{
    playerGroup(){
      let res = [[],[],[],[]];
      var list = this.list?this.list:[];
      for(var i=0;i<list.length;i++){
        res[list[i].position].push(list[i]);
      }
      return res;
    }
  }
}
</script>