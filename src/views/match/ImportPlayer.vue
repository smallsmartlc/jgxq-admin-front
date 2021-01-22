<template>
  <el-dialog title="导入球员" :visible.sync="importDialog" width="30%" :before-close="close">
  <el-checkbox :indeterminate="isIndeterminate" v-model="data" @change="handleCheckAllChange">全选</el-checkbox>
  <el-checkbox-group v-model="data">
    <el-checkbox :label="item" v-for="(item,index) in players" :key="index" border>
        <div style="display:flex;flex-wrap:wrap;align-items:center">
            <div class="circle">{{item.number}}</div>
            <div>{{item.name}}</div>
            <div style="font-size:12px">{{positionMap[item.matchPos]}}</div>
        </div>
    </el-checkbox>
  </el-checkbox-group>
  <div slot="footer" class="dialog-footer">
    <el-button @click="close()">取 消</el-button>
    <el-button type="primary" @click="importPlayer">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
export default {
    data() {
        return {
            data : [],
            rules: {
                name: [{ required: true, message: '请输入姓名', trigger: 'blur' },],
                matchPos: [{ required: true, message: '请填写位置', trigger: 'blur' },],
                number: [{ required: true, message: '请填写号码', trigger: 'blur' },],
            },
            positionMap : ["门将","后卫","中场","前腰","前锋"],
            isIndeterminate : false,
        }
    },
    props : {
        importDialog : Boolean,
        players : Array,
    },
    watch:{
        item(n,o){
            this.player.name = n.name
            this.player.matchPos = n.matchPos
            this.player.number = n.number
        }
    },
    methods: {
        importPlayer(){
            this.$emit("submit",this.data)
            this.data = [];
        },
        close(){
            this.data = [];
            this.$emit("close");
        },
        handleCheckAllChange(val){
            this.data = val ? this.players : [];
            this.isIndeterminate = false;
        }
    },
}
</script>

<style scoped>
.circle{
    border-radius: 50%;
    background-color: #409EFF;
    color: #fff;
    text-align: center;
    line-height: 20px;
    width: 20px;
    height: 20px;
    margin-right: 4px;
}
</style>