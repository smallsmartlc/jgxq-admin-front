<template>
  <div class="app-container">
    <div style="margin-bottom:10px"><router-link to="/match/add"><el-button type="primary" icon="el-icon-plus">添加比赛</el-button></router-link></div>
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
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="主队" width="110px">
        <template slot-scope="scope">
          <div v-if="scope.row.homeTeam">
            <div><el-image style="width: 80px; height: 80px" :src="$utils.url2img(scope.row.homeTeam.logo)" fit="contain"></el-image></div>
            <div>{{scope.row.homeTeam.name}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客队" width="110px">
        <template slot-scope="scope">
          <div v-if="scope.row.visitingTeam">
            <div><el-image style="width: 80px; height: 80px" :src="$utils.url2img(scope.row.visitingTeam.logo)" fit="contain"></el-image></div>
            <div>{{scope.row.visitingTeam.name}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="比分">
        <template slot-scope="scope">
          <div v-if='dateDiff(scope.row.startTime)>0'>{{scope.row.homeScore}}-{{scope.row.visitingScore}}</div>
          <div v-else>未开始</div>
        </template>
      </el-table-column>
      <el-table-column label="视频" width="80">
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.link" :underline="false">视频地址</el-link>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="比赛信息" align="center">
        <template slot-scope="scope">
          <router-link :to="`/match/${scope.row.id}`"><el-link style="margin-right:10px" type="primary" :underline="false">编辑</el-link></router-link>
          <el-link type="primary" @click="openDelete(scope.row)" :underline="false">删除</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="startTime" label="比赛时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ $moment(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="display:flex;flex-direction:row-reverse;">
      <el-pagination layout="prev, pager, next" :current-page="cur" @current-change="changePage" :page-size="size" :total="total"/>
    </div>
  </div>
</template>

<script>
import { pageMatches,deleteMatchById} from '@/api/match'

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
      pageMatches(this.cur,this.size).then(res => {
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
      this.$confirm('此操作将删除该比赛的所有信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMatchById(item.id).then((res)=>{
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
  },
  computed : {
    dateDiff(){
        return function(timeStr){
            var time = new Date(timeStr)
            return new Date()-time; 
        }
    },
  }
}
</script>