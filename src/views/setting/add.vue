<template>
  <div class="app-container">
    <el-card class="box-card">
      <div>
        <el-form ref="form" label-width="160px" :model="formdata" :rules="ruleValidate">
          <el-form-item label="预约日期" prop="date">
            <el-date-picker
              v-model="formdata.date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择预约日期"
              :editable="false"
              style="width: 100%;"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <!-- <el-form-item label="选择时段" prop="am_pm">
            <el-radio-group v-model="formdata.am_pm">
              <el-radio :label="1">上午</el-radio>
              <el-radio :label="2">下午</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-divider />
          <el-form-item label="每次(半天)放号数量" prop="nums">
            <el-input-number v-model="formdata.nums" :step="1" :min="1" step-strictly />
          </el-form-item>
          <el-form-item label="开放天数" prop="count">
            <el-input-number v-model="formdata.count" :step="0.5" :min="0.5" step-strictly /> 天<template v-if="formdata.count">（{{ formdata.count * 2 }}次）</template>
          </el-form-item>
          <el-form-item label="放号日期时间">
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
        // am_pm: '',
        begindate: '',
        begintime: '',
        can_apply: '',
        nums: '',
        count: '0.5'
      },
      ruleValidate: {
        date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        // am_pm: [
        //   { required: true, message: '请选择时段', trigger: 'change' }
        // ],
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
        ],
        count: [
          { required: true, message: '请输入放号次数', trigger: 'blur' }
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
          this.submitAll()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submitAll() {
      var requestList = []
      requestList = await this.postAll()
      await Promise.all(requestList).then(async(result) => {
        this.$message({
          message: '配置已提交',
          type: 'success'
        })
        this.$refs.form.resetFields()
        this.$router.push('/setting/index')
      }).catch((error) => {
        console.log('配置失败了')
        console.log(error)
      })
    },
    async postAll() {
      var that = this
      var requests = []
      for (var i = 0; i < this.formdata.count * 2; i++) {
        var date = this.formatdate(parseInt(i / 2) * (24 * 60 * 60 * 1000) + new Date(that.formdata.date).getTime())
        var data = {
          date: date,
          am_pm: i % 2 === 0 ? 1 : 2,
          nums: that.formdata.nums,
          can_apply: that.formdata.can_apply
        }
        var res = editDate(data)
        requests.push(res)
      }
      return requests
    },
    reset() {
      this.$refs.form.resetFields()
    },
    formatdate(haomiao) {
      if (!haomiao) return ''
      const date = new Date(haomiao)
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds()
      }
      return formatObj.y + '-' + formatObj.m.toString().padStart(2, '0') + '-' + formatObj.d.toString().padStart(2, '0')
      // return formatObj.y + '-' + formatObj.m.toString().padStart(2, '0') + '-' + formatObj.d.toString().padStart(2, '0') + ' ' + formatObj.h.toString().padStart(2, '0') + ':' + formatObj.i.toString().padStart(2, '0') + ':' + formatObj.s.toString().padStart(2, '0')
    }
  }
}
</script>

<style>
.box-card {
  width: 700px;
  margin: 0 auto;
}
.line {
  text-align: center;
}
</style>
