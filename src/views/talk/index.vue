<template>
  <div class="app-container">
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
      <el-table-column label="用户" width="100px">
        <template slot-scope="scope">
          {{ scope.row.author }}
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          {{ scope.row.text }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="球队信息" width="80" align="center">
        <template slot-scope="scope">
          <el-link type="primary" @click="openDelete(scope.row)" :underline="false">删除</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="发布时间" width="200">
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
import { pageTalk,deleteTalk} from '@/api/talk'

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
      pageTalk(this.cur,this.size).then(res => {
        if(res.code == 200){
          this.list = res.data.records;
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
      this.$confirm('此操作将删除该帖, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTalk(item.id).then((res)=>{
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