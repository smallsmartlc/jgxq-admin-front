<template>
  <div class="app-container">
    <div style="margin-bottom:10px"><router-link to="/player"><el-button type="primary" icon="el-icon-plus">添加队员</el-button></router-link></div>
    <div v-for="item in list" :key="item.name">
      <h3>{{item.name}}</h3>
      <div>
        <el-table
        :data="item.playerList"
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
  }
}
</script>