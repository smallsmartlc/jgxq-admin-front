<template>
  <div class="app-container">
    <div style="display:flex;margin-bottom:10px">
      <el-button @click="openTopDialog" type="primary" plain>置顶列表</el-button>
      <el-input
        style="width:200px;margin-left:5px"
        placeholder="搜索新闻"
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
      <el-table-column label="作者" width="100px">
        <template slot-scope="scope">
          {{ scope.row.author }}
        </template>
      </el-table-column>
      <el-table-column label="封面" width="110px">
        <template slot-scope="scope">
          <el-image style="width: 80px; height: 80px" :src="$utils.url2img(scope.row.cover)" fit="cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false">{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button style="margin-right:10px" @click="openTop(scope.row.id)" type="text">置顶</el-button>
          <router-link :to="`/news/${scope.row.id}`"><el-button style="margin-right:10px" type="text">编辑</el-button></router-link>
          <el-button @click="openDelete(scope.row)" type="text">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ $moment(scope.row.createAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="display:flex;flex-direction:row-reverse;">
      <el-pagination layout="prev, pager, next" :current-page="cur" @current-change="changePage" :page-size="size" :total="total"/>
    </div>
    <el-dialog title="置顶列表" :visible.sync="topDialog">
      <el-table :data="topNews">
        <el-table-column property="id" label="id" width="150"></el-table-column>
        <el-table-column label="封面" width="110px">
          <template slot-scope="scope">
            <el-image style="width: 80px; height: 80px" :src="$utils.url2img(scope.row.cover)" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column property="title" label="标题"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin-right:10px" @click="removeTop(scope.row.id)" type="text">移除置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { pageNews,deleteNews,addTopNews,deleteTopNews,listTopNews} from '@/api/news'

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
      topNews : null,
      topDialog :false,
      keyword : null,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      pageNews(this.cur,this.size,this.keyword).then(res => {
        if(res.code == 200){
          this.list = res.data.records;
          this.total = res.data.total;
          this.listLoading = false
        }
      }).catch(()=>{this.listLoading = false})
    },
    loadTopNews(){
      listTopNews().then((res)=>{
        if(res.code == 200){
          this.topNews = res.data;
        }
      })
    },
    changePage(val){
      this.cur = val;
      this.fetchData();
    },
    openDelete(item) {
      this.$confirm('此操作将删除该新闻, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNews(item.id).then((res)=>{
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
    },
    openTop(id) {
      this.$confirm('确定要将该条新闻置顶吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addTopNews(id).then((res)=>{
          if(res.code == 200){
            if(res.data){
              this.$message.success('该新闻已置顶');
              this.loadTopNews();
            }else{
              this.$message.error('置顶失败!');
            }
          }
        })
      }).catch();
    },
    openTopDialog(){
      if(!this.topNews){
        this.loadTopNews();
      }
      this.topDialog = true;
    },
    removeTop(id){
      deleteTopNews(id).then((res)=>{
        if(res.code == 200){
          if(res.data){
            this.$message.success('移除置顶成功');
            this.loadTopNews();
          }else{
            this.$message.error('移除置顶失败!');
          }
        }
      })
    }
  }
}
</script>