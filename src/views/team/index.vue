<template>
  <div class="app-container">
    <div style="margin-bottom:10px">
      <router-link to="/team/add"><el-button type="primary" icon="el-icon-plus">添加球队</el-button></router-link>
      <el-input
        style="width:200px;margin-left:5px"
        placeholder="搜索球队"
        clearable
        v-model="keyword">
        <el-button slot="append" @click="fetchData" icon="el-icon-search"></el-button>
      </el-input>
    </div>
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
          <router-link :to="`/team/${scope.row.id}`"><el-link style="margin-right:10px" type="primary" :underline="false">编辑</el-link></router-link>
          <el-link type="primary" @click="openDelete(scope.row)" :underline="false">删除</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span v-if="scope.row.createAt">{{ $moment(scope.row.createAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="display:flex;flex-direction:row-reverse;">
      <el-pagination layout="prev, pager, next" :current-page="cur" @current-change="changePage" :page-size="size" :total="total"/>
    </div>
  </div>
</template>

<script>
import { pageTeams,deleteTeam} from '@/api/team'

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
      keyword : null,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      pageTeams(this.cur,this.size,{keyword : this.keyword}).then(res => {
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
    },
    openDelete(item) {
      this.$confirm('此操作将删除该球队, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTeam(item.id).then((res)=>{
          if(res.code == 200){
            if(res.data){
              this.fetchData();
              this.$message.success('删除成功!');
            }else{
              this.$message.error('删除失败!');
            }
          }
        })
      }).catch();
    }
  }
}
</script>