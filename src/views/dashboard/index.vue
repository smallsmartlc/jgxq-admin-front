<template>
  <div class="dashboard-container">
    <div class="dashboard-text">角色: {{ roleName }}</div>
    <div><el-button type="text" @click="dialogFormVisible = true">修改密码</el-button></div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="passwordReq" :rules="rules" ref="ruleForm" label-width="100px" >
        <el-form-item label="输入旧密码" prop="oldPassword">
          <el-input type="password" v-model="passwordReq.oldPassword" show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="输入新密码" prop="password">
          <el-input type="password" v-model="passwordReq.password" show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
          <el-input type="password" v-model="passwordReq.checkpass" show-password autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {validatePass} from "@/utils/validateInput"
import {resetPassword} from  "@/api/auth"
import {logOut} from '@/utils/cookies'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'roleName'
    ])
  },
  data() {
    var validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
          callback(new Error('请再次输入密码'));
      } else if (value !== this.passwordReq.password) {
          callback(new Error('两次输入密码不一致!'));
      } else {
          callback();
      }
    };
    return {
      dialogFormVisible : false,
      passwordReq : {
        oldPassword : "",
        password : "",  
        checkpass : "",
      },
      rules : {
        oldPassword : [{validator:validatePass, trigger: 'blur' },],
        password : [{validator:validatePass, trigger: 'blur' },],
        checkpass : [{validator:validatePassConfirm, trigger: 'blur' },],
      }
    }
  },
  methods : {
    resetPassword(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          resetPassword(this.passwordReq).then((res)=>{
            if(res.code == 200){
              if(res.data){
                this.$message.success("密码修改成功");
                this.dialogFormVisible = false;
                logOut();
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              }
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
