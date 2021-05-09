<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="create_time_range">
        <el-date-picker
          v-model="filterForm.date_range"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="预约开始日期"
          end-placeholder="预约结束日期"
        />
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="filterForm.name" placeholder="学生姓名" style="width:120px" />
      </el-form-item>
      <el-form-item prop="sex">
        <el-select v-model="filterForm.sex" placeholder="性别" style="width:80px">
          <el-option label="男" :value="1" />
          <el-option label="女" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item> -->
    </el-form>

    <div>
      <el-input v-model="filename" placeholder="请输入导出文件名 (默认 学生预约排行记录)" style="width:345px;" prefix-icon="el-icon-document" />
      <el-button :loading="downloadLoading" style="margin:0 0 10px 10px;" type="primary" icon="el-icon-document" @click="exportOrder">
        导出
      </el-button>
    </div>

    <el-table id="export" v-loading="listLoading" :data="list" element-loading-text="Loading..." border fit highlight-current-row size="small">
      <el-table-column label="预约日期" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.apply_date }}
        </template>
      </el-table-column>
      <el-table-column label="时段" align="center" width="100">
        <template slot-scope="scope">
          {{ parseInt(scope.row.am_pm) === 1? '上午' : '下午' }}
        </template>
      </el-table-column>
      <el-table-column label="排号" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.no }}
        </template>
      </el-table-column>
      <el-table-column label="学生姓名" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" width="50">
        <template slot-scope="scope">
          {{ parseInt(scope.row.sex) === 1? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.contract_number }}
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center">
        <template slot-scope="scope">
          {{ scope.row.idc_no }}
        </template>
      </el-table-column>
      <el-table-column label="户口所在地" align="center">
        <template slot-scope="scope">
          {{ scope.row.province }} {{ scope.row.city }} {{ scope.row.area }}
        </template>
      </el-table-column>
      <el-table-column label="家庭住址" align="center">
        <template slot-scope="scope">
          {{ scope.row.officer_name }}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script>
import { fetchList } from '@/api/order'

import Pagination from '@/components/Pagination'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  name: 'ExportExcel',
  components: { Pagination },
  data() {
    return {
      total: 0,
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: '',
      filterForm: {
        date_range: [],
        name: '',
        sex: ''
      },
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchList(this.listQuery).then(data => {
        this.list = data.items
        this.total = data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      if (this.filterForm.date_range && this.filterForm.date_range.length) {
        this.listQuery.date_range = this.filterForm.date_range
      }
      if (this.filterForm.name !== '') {
        this.listQuery.name = this.filterForm.name
      }
      if (this.filterForm.sex !== '') {
        this.listQuery.sex = this.filterForm.sex
      }
      this.fetchData()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.handleFilter()
    },
    exportOrder() {
      /* generate workbook object from table */
      var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
      var wb = XLSX.utils.table_to_book(
        document.querySelector('#export'),
        xlsxParam
      )

      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          (this.filename ? this.filename : '学生预约排行记录') + '.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    }
  }
}
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
