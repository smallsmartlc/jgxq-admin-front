<template>
  <el-dialog title="修改球员" :visible.sync="editDialog" width="30%" :before-close="close">
  <el-form :model="player" :rules="rules" ref="editForm">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="player.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="位置" prop="matchPos">
        <el-select v-model="player.matchPos" placeholder="请选择">
            <el-option
              v-for="item in positionStr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="号码" prop="number">
      <el-input-number v-model="player.number" controls-position="right" :min="0" />
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="close()">取 消</el-button>
    <el-button type="primary" @click="editPlayer">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
export default {
    data() {
        return {
            player:{
                matchPos: 0,
                name : null,
                number: 0,
            },
            rules: {
                name: [{ required: true, message: '请输入姓名', trigger: 'blur' },],
                matchPos: [{ required: true, message: '请填写位置', trigger: 'blur' },],
                number: [{ required: true, message: '请填写号码', trigger: 'blur' },],
            },
            positionStr : [{value:0,label:"门将"},{value:1,label:"后卫"},{value:2,label:"中场"},{value:3,label:"前腰"},{value:4,label:"前锋"}],
        }
    },
    props : {
        editDialog : Boolean,
        item : Object
    },
    watch:{
        item(n,o){
            this.player.name = n.name
            this.player.matchPos = n.matchPos
            this.player.number = n.number
        }
    },
    methods: {
        editPlayer(){
            this.$refs["editForm"].validate((valid) => {
                if (valid) {
                    this.item.name = this.player.name;
                    this.item.matchPos = this.player.matchPos;
                    this.item.number = this.player.number
                    this.close();
                }
            })
        },
        close(){
            this.$emit("close");
        }
    },
}
</script>

<style>

</style>