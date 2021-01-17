<template>
  <div class="app-container">
    <div style="margin-bottom :20px">
      <el-input style="width:250px" placeholder="根据用户名搜索" v-model="userReq.keyWord" class="input-with-select" clearable>
        <el-button slot="append" @click="searchData" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="userkey" width="95">
        <template slot-scope="scope">
          {{ scope.row.userkey }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="95">
        <template slot-scope="scope">
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="主队">
        <template slot-scope="scope">
          {{ scope.row.homeTeam }}
        </template>
      </el-table-column>
      <el-table-column label="城市">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="80" align="center">
        <template slot-scope="scope">
          <el-button @click="setAuthor(scope.row)" :type="scope.row.author?'primary':'danger'" :icon="scope.row.author?'el-icon-check':'el-icon-close'" circle></el-button>
        </template>
      </el-table-column>
      <el-table-column label="主队" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.homeTeam }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ $moment(scope.row.createAt).format("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-link style="margin:5px" type="primary" @click="resetPassword(scope.row)" :underline="false">重置密码</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="display:flex;flex-direction:row-reverse;">
      <el-pagination
        layout="prev, pager, next" :current-page="cur" @current-change="changePage" :page-size="size" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { pageUser,updateUser,resetPassword } from '@/api/user'

export default {
  data() {
    return {
      list: null,
      listLoading: false,
      cur : 1,
      size : 10,
      total : 0,
      userReq : {
        keyWord : null,
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      pageUser(this.cur,this.size,this.userReq).then(response => {
        this.list = response.data.records
        this.total =  response.data.total
        this.listLoading = false
      })
    },
    changePage(val){
      this.cur = val;
      this.fetchData();
    },
    searchData(){
      this.fetchData();
    },
    setAuthor(user){
      this.$confirm(`确定要将${user.nickName}${user.author?'移除作者权限':'设置为作者'}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var req = {author : !user.author}
        console.log(user);
        updateUser(user.userkey,req).then((res)=>{
          if(res.code == 200){
            if(res.data){
              user.author = !user.author;
            }
          }
        })
      }).catch();
    },
    resetPassword(user){
      this.$confirm(`确定要将${user.nickName}的密码重置吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPassword(user.userkey).then((res)=>{
          if(res.code == 200){
            if(res.data){
              this.$message.success("重置密码成功!新密码 : abc123")
            }
          }
        })
      })
    }
  }
}
</script>