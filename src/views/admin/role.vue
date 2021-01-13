<template>
  <div class="app-container">
    <div style="margin-bottom:10px"><el-button type="primary" @click="addDialog = true" icon="el-icon-plus">添加管理员</el-button></div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="adminKey" width="95">
        <template slot-scope="scope">
          {{ scope.row.adminKey }}
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template slot-scope="scope">
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column label="账户名" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.adminName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <el-link style="margin:5px" type="primary" :underline="false">修改</el-link>
          <el-link style="margin:5px" type="primary" @click="openDelete(scope.row)" :underline="false">删除</el-link>
          <el-link style="margin:5px" type="primary" @click="openPassword(scope.row)" :underline="false">重置密码</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="收货地址" :visible.sync="addDialog">
      <el-form :model="adminAddReq">
        <el-form-item label="昵称">
          <el-input v-model="adminAddReq.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账户名">
          <el-input v-model="adminAddReq.adminName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="adminAddReq.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分配角色">
          <el-select v-model="adminAddReq.roleId" placeholder="请选择角色">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.name"></el-option>
            
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageAdmin } from '@/api/admin'
import { listBasicRole } from '@/api/role'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
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
      addDialog : false,
      adminAddReq:{
        nickName : "",
        adminName : "",
        password : "",
        roleId : "",
      },
      roles : [],
    }
  },
  created() {
    this.fetchData();
    this.listRole();
  },
  methods: {
    fetchData() {
      this.listLoading = true
      pageAdmin(this.cur,this.size).then(res => {
        this.list = res.data.records
        this.total = res.data.total; 
        this.listLoading = false
      })
    },
    listRole(){
      listBasicRole().then((res)=>{
        this.roles = res.data;
      })
    },
    openPassword(item){
      this.$prompt('请输入新密码', '重置密码', {
          confirmButtonText: '重置',
          cancelButtonText: '取消',
          inputValidator: (value)=>{
            if (value === '') {
                return ('请输入密码');
            } else {
                const reg = /^(?![A-Za-z]+$)(?!\d+$)(?![\W_]+$)(?![\u4e00-\u9fa5]+)\S+$/;
                const len = value.split('').length
                if (len < 6 || len > 15) {
                    return '密码长度在 6 到 15 个字符';
                } else if (!(reg.test(value))) {
                    return '密码包含字母、数字和标点符号中至少2种';
                } else {
                    return true;
                }
            }
          },
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你的邮箱是: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    openDelete(item) {
      this.$confirm('此操作将注销该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch();
    },
  }
}
</script>
