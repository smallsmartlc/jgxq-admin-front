<template>
    <div>
        <el-form inline class="demo-form-inline">
            <el-form-item prop="number">
                <el-input type="text" clearable v-model.number="ingMatchId" maxlength="20" :minlength="1" show-word-limit placeholder="输入比赛id">
                    <el-button type="primary" slot="append" :loading="importLoading"  @click="importPlayFromIng">查询</el-button>
                </el-input>
            </el-form-item>
            <el-button type="primary" :loading="addLoading"  @click="addBatchPlayer">导入</el-button>
        </el-form>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div>
            <el-checkbox-group v-model="data" @change="handleCheckedPlayersChange">
                <div style="display:flex;justify-content:space-between">
                    <div>
                        <el-checkbox :label="item" v-for="(item,index) in home" :key="'2-'+index" border>
                            <div style="display:flex;flex-wrap:wrap;align-items:center">
                                <div class="circle">{{item.number}}</div>
                                <div>{{item.name}}</div>
                            </div>
                        </el-checkbox>
                    </div>
                    <div>
                        <el-checkbox :label="item" v-for="(item,index) in sub" :key="'1-'+index" border>
                            <div style="display:flex;flex-wrap:wrap;align-items:center">
                                <div class="circle">{{item.number}}</div>
                                <div>{{item.name}}</div>
                            </div>
                        </el-checkbox>
                    </div>
                </div>
            </el-checkbox-group>
        </div>
    </div>
</template>

<script>
import { importPlayerFromIng,addBatchPlayer } from '@/api/player'
export default {
    data() {
        return {
            importLoading : false,
            isIndeterminate : false,
            checkAll : false,
            data:[],
            ingMatchId : null,
            home : [],
            sub : [],
            addLoading : false,
        }
    },
    methods: {
        handleCheckAllChange(val){
            this.data = val ? this.list : [];
            this.isIndeterminate = false;
        },
        handleCheckedPlayersChange(val){
            let checkedCount = val.length;
            this.checkAll = checkedCount === this.list.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
        },
        importPlayFromIng(){
            this.importLoading = true;
            importPlayerFromIng(this.ingMatchId).then(res=>{
                if(res.code == 200){
                this.home = res.data.homeList;
                this.sub = res.data.subList;
                }
            }).finally(()=>{
                this.importLoading = false;
            })
        },
        addBatchPlayer(){
            if(!this.data || this.data.length < 1){
                this.$message.warning("至少选择一名队员");
                return;
            }
            this.addLoading = true;
            addBatchPlayer({teamId : this.$route.params.id,players : this.data})
            .then((res)=>{
                this.$message.success(`保存成功,共增加了${res.data}名球员`);
            })
            .finally(()=>{
                this.addLoading = false; 
            })
        }
    },
    computed:{
        list(){
           return this.home.concat(this.sub) 
        }
    }
}
</script>

<style>

</style>