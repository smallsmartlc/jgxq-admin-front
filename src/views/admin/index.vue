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
      <el-table-column align="center" label="adminKey" width="120">
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
          {{ scope.row.role.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <el-link style="margin:5px" type="primary" @click="openEdit(scope.row)" :underline="false">修改</el-link>
          <el-link style="margin:5px" type="primary" @click="openDelete(scope.row)" :underline="false">删除</el-link>
          <el-link style="margin:5px" type="primary" @click="openPassword(scope.row)" :underline="false">重置密码</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="display:flex;flex-direction:row-reverse;">
      <el-pagination layout="prev, pager, next" :current-page="cur" @current-change="changePage" :page-size="size" :total="total"/>
    </div>
    <el-dialog title="添加管理员账户" :visible.sync="addDialog">
      <el-form :rules="rules" ref="addForm" :model="adminAddReq">
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="adminAddReq.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账户名" prop="adminName">
          <el-input v-model="adminAddReq.adminName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adminAddReq.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分配角色" prop="roleId">
          <el-select v-model="adminAddReq.roleId" prop="roleId" placeholder="请选择角色">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <router-link to="/admin/role"><el-link style="margin:5px" type="primary" :underline="false">添加角色</el-link></router-link>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addAdmin">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑管理员信息" :visible.sync="editDialog">
      <el-form :rules="rules" ref="editForm" :model="adminEditReq">
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="adminEditReq.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账户名" prop="adminName">
          <el-input v-model="adminEditReq.adminName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="修改角色" prop="roleId">
          <!-- <el-select v-model="editRoleId" prop="roleId" placeholder="请选择角色"> -->
          <el-select v-model="adminEditReq.roleId" prop="roleId" placeholder="请选择角色">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <router-link to="/admin/role"><el-link style="margin:5px" type="primary" :underline="false">添加角色</el-link></router-link>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editAdmin">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageAdmin,adminReg , updateAdmin,deleteAdmin,resetPassword} from '@/api/admin'
import { listBasicRole } from '@/api/role'
import {validateAdmin,validatePass} from "@/utils/validateInput"
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
      editDialog : false,
      rules: {
        nickName : [{ required: true, message: '昵称不能为空', trigger: 'change' }],
        adminName : [{ required: true, message: '账户名不能为空', trigger: 'blur' },{validator:validateAdmin, trigger: 'change' }],
        password : [{ required: true, message: '密码不能为空', trigger: 'blur' },{validator:validatePass, trigger: 'change' },],
        roleId : [{ required: true, message: '需要分配角色', trigger: 'blur' }],
      },
      adminAddReq:{
        nickName : "",
        adminName : "",
        roleId : "",
      },
      adminEditReq:{},
      roles : [],
    }
  },
  mounted() {
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
      }).catch(()=>{this.listLoading = false})
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
            if (!value) {
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
          resetPassword(item.adminKey,value).then((res)=>{
            if(res.code == 200){
              this.$message.success("重置密码成功!")
            }
          })
        }).catch();
    },
    openDelete(item) {
      this.$confirm('此操作将注销该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdmin(item.adminKey).then((res)=>{
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
    openEdit(item){
      const {adminKey,adminName,nickName} = item
      this.adminEditReq = {
        adminKey,
        adminName,
        nickName,
        roleId : item.role.id,
      };
      // this.editRoleId = item.role.id;
      this.editDialog = true;
    },
    addAdmin(){
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          adminReg(this.adminAddReq).then((res)=>{
            if(res.code == 200){
              this.$message.success('添加成功!');
              this.fetchData();
              this.addDialog = false;
              this.adminAddReq = {
                nickName : "",
                adminName : "",
                roleId : "",
              }
            }
          })
        }
      })
    },
    editAdmin(){
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          updateAdmin(this.adminEditReq).then((res)=>{
            if(res.code == 200){
              this.$message.success('修改成功!');
              this.fetchData();
              this.editDialog = false;
            }
          })
        }
      })
    },
    changePage(val){
      this.cur = val;
      this.fetchData();
    }
  }
}
</script>
