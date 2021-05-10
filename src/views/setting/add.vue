<template>
  <div class="app-container">
    <el-card class="box-card">
      <div>
        <el-form ref="form" label-width="80px" :model="formdata" :rules="ruleValidate">
          <el-form-item label="选择日期" prop="date">
            <el-date-picker
              v-model="formdata.date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :editable="false"
              style="width: 100%;"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="选择时段" prop="am_pm">
            <el-radio-group v-model="formdata.am_pm">
              <el-radio :label="1">上午</el-radio>
              <el-radio :label="2">下午</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-divider />
          <el-form-item label="放号时间">
            <el-col :span="11">
              <el-form-item prop="begindate">
                <el-date-picker v-model="formdata.begindate" type="date" placeholder="日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="begintime">
                <el-time-picker v-model="formdata.begintime" placeholder="时间" format="HH:mm:ss" value-format="HH:mm:ss" :editable="false" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="放号数量" prop="nums">
            <el-input v-model="formdata.nums" placeholder="输入放号数量" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">设置</el-button><el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { editDate } from '@/api/order'
import { parseTime } from '@/utils/index'

export default {
  data() {
    return {
      today: parseTime(new Date(new Date().toLocaleDateString()).getTime(), '{y}-{m}-{d}'),
      tomorrow: parseTime(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000, '{y}-{m}-{d}'),
      pickerOptions: {
        disabledDate(val) {
          return new Date(val).getTime() < new Date(new Date().toLocaleDateString()).getTime()
        }
      },
      formdata: {
        date: parseTime(new Date().getTime() + 24 * 60 * 60 * 1000, '{y}-{m}-{d}'),
        am_pm: '',
        begindate: '',
        begintime: '',
        can_apply: '',
        nums: ''
      },
      ruleValidate: {
        date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        am_pm: [
          { required: true, message: '请选择时段', trigger: 'change' }
        ],
        nums: [
          { required: true, message: '请输入放号数量', trigger: 'blur' }
        ],
        begindate: [
          { required: true, message: '请选择放号时间', trigger: 'change' }
        ],
        begintime: [
          { required: true, message: '请选择放号时间', trigger: 'change' }
        ],
        can_apply: [
          { required: true, message: '请选择放号时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    can_apply: function() {
      return this.formdata.begindate + ' ' + this.formdata.begintime
    }
  },
  watch: {
    can_apply(val) {
      this.formdata.can_apply = this.can_apply
    }
  },
  created() {
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          editDate(this.formdata).then((res) => {
            console.log(res)
            this.$message({
              message: '配置已提交',
              type: 'success'
            })
            this.$refs.form.resetFields()
          }).catch(error => {
            console.log(error)
            // this.$message({
            //   message: error.message || '操作失败！',
            //   type: 'error'
            // })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style>
.box-card {
  width: 500px;
  margin: 0 auto;
}
.line {
  text-align: center;
}
</style>
