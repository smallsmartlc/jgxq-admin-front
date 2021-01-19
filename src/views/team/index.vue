<template>
  <div class="app-container">
    <div style="margin-bottom:10px"><router-link to="/team/add"><el-button type="primary" icon="el-icon-plus">添加球队</el-button></router-link></div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="球队名" width="110">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="队徽">
        <template slot-scope="scope">
          <el-image style="width: 80px; height: 80px" :src="$utils.url2img(scope.row.logo)" fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="球员" width="110" align="center">
        <template slot-scope="scope">
          <router-link :to="`/team/player/${scope.row.id}`"><el-link type="primary" :underline="false">查看球员</el-link></router-link>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="球队信息" width="110" align="center">
        <template slot-scope="scope">
          <router-link :to="`/team/${scope.row.id}`"><el-link type="primary" :underline="false">编辑</el-link></router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ $moment(scope.row.createAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="display:flex;flex-direction:row-reverse;">
      <el-pagination layout="prev, pager, next" :current-page="cur" @current-change="changePage" :page-size="size" :total="total"/>
    </div>
  </div>
</template>

<script>
import { PageTeams } from '@/api/team'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      cur : 1,
      size : 10,
      total : 0,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      PageTeams(this.cur,this.size).then(res => {
        if(res.code == 200){
          this.list = res.data.data;
          this.total = res.data.total;
          this.listLoading = false
        }
      }).catch(()=>{this.listLoading = false})
    },
    changePage(val){
      this.cur = val;
      this.fetchData();
    }
  }
}
</script>