<template>
  <div class="app-container">
    <div style="margin-bottom:10px"><el-button type="primary" @click="addDialog = true" icon="el-icon-plus">添加角色</el-button></div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="id" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="角色名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="权限" width="110" align="center">
        <template slot-scope="scope">
          <el-link style="margin:5px" type="primary" @click="openEdit(scope.row.id)" :underline="false">配置权限</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="删除" width="100">
        <template slot-scope="scope">
          <el-link style="margin:5px" type="primary" @click="openDelete(scope.row.id)" :underline="false">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加角色" :visible.sync="addDialog">
      <el-form :rules="rules" ref="addForm" :model="roleAddReq">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="roleAddReq.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-transfer v-model="roleAddReq.permissions" :data="permissionData"></el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改角色" :visible.sync="editDialog">
      <el-form :rules="rules" ref="editForm" :model="roleEditReq">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="roleEditReq.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-transfer v-model="roleEditReq.permissions" :data="permissionData"></el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageAdmin } from '@/api/admin'
import { listBasicRole,getRoleById,listPermissions,addRole,editRole,deleteRole } from '@/api/role'
import {validateArray} from "@/utils/validateInput"
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
      permissions : [],
      listLoading: true,
      cur : 1,
      size : 10,
      total : 0,
      addDialog : false,
      editDialog : false,
      roleAddReq:{
        name : "",
        permissions : [], 
      },
      roleEditReq:{},
      roles : [],
      rules: {
        name : [{ required: true, message: '角色名不能为空', trigger: 'change' }]
      },
    }
  },
  created() {
    this.fetchData();
    this.listPermissions();
  },
  methods: {
    listPermissions(){
      listPermissions().then((res)=>{
        this.permissions = res.data
      })
    },
    fetchData() {
      this.listLoading = true
      listBasicRole().then(res => {
        this.list = res.data 
        this.listLoading = false
      }).catch(()=>{this.listLoading = false})
    },
    addRole(){
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          addRole(this.roleAddReq).then((res)=>{
            if(res.code == 200){
              this.list.push({
                id : res.data,
                name : this.roleAddReq.name
              })
              this.roleAddReq = {
                name : "",
                permissions : [], 
              },
              this.addDialog = false
            }
          })
        }
      })
    },
    openEdit(id){
      getRoleById(id).then((res)=>{
        if(res.code == 200){
          this.roleEditReq = res.data;
           this.editDialog = true;
        }
      })
    },
    editRole(){
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          editRole(this.roleEditReq).then((res)=>{
            if(res.code == 200){
              if(res.data){
                this.$message.success("修改成功!");
                this.fetchData();
                this.editDialog = false;
              }else{
                this.$message.warning("修改失败");
              }
            }
          })
        }
      })
    },
    openDelete(id) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(id).then((res)=>{
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
  },
  computed : {
    permissionData(){
      const data = [];
      for (let i = 0; i < this.permissions.length; i++) {
        data.push({
          key: this.permissions[i].code,
          label: this.permissions[i].name
        });
      }
      return data;
    }
  }
}
</script>
