// pages/civil-cause/civil-cause.js
Page({
  data: {
    searchKeyword: '',
    activeTab: 0,
    filterTag: 'all',
    categories: [
      { name: '全部', id: 'all' },
      { name: '人格权', id: 'personality' },
      { name: '婚姻家庭', id: 'family' },
      { name: '物权', id: 'property' },
      { name: '合同', id: 'contract' },
      { name: '知识产权', id: 'ip' },
      { name: '数据网络', id: 'data' },
      { name: '劳动人事', id: 'labor' },
      { name: '公司证券', id: 'corporate' },
      { name: '海事海商', id: 'maritime' },
      { name: '侵权责任', id: 'tort' },
      { name: '非讼程序', id: 'nonlitigation' }
    ],
    causes: [],
    filteredCauses: [],
    totalCauses: 0,
    showDetail: false,
    selectedCause: {}
  },

  onLoad() {
    this.initCauses()
  },

  /**
   * 初始化案由数据（2025年最新版）
   * 法〔2025〕226号，2026年1月1日起施行
   */
  initCauses() {
    const causes = [
      // 第一部分：人格权纠纷
      {
        id: 1,
        code: '一',
        name: '人格权纠纷',
        category: 'personality',
        tag: 'tort',
        desc: '《民法典》第四编',
        children: [
          { code: '1', name: '生命权、身体权、健康权纠纷', tag: 'common' },
          { code: '2', name: '姓名权纠纷', tag: 'common' },
          { code: '3', name: '名称权纠纷', tag: 'common' },
          { code: '4', name: '肖像权纠纷', tag: 'common' },
          { code: '5', name: '隐私权、个人信息保护纠纷', tag: 'common' },
          { code: '6', name: '名誉权纠纷', tag: 'common' },
          { code: '7', name: '荣誉权纠纷' },
          { code: '8', name: '人身自由权纠纷' },
          { code: '9', name: '一般人格权纠纷', tag: 'common' },
          { code: '10', name: '因当事人一方违约而损害对方人格权并造成严重精神损害的赔偿纠纷' }
        ]
      },

      // 第二部分：婚姻家庭、继承纠纷
      {
        id: 2,
        code: '二',
        name: '婚姻家庭、继承纠纷',
        category: 'family',
        tag: 'family',
        desc: '《民法典》第五编',
        children: [
          { code: '1', name: '婚约财产纠纷', tag: 'common' },
          { code: '2', name: '离婚纠纷', tag: 'common' },
          { code: '3', name: '离婚后财产纠纷', tag: 'common' },
          { code: '4', name: '婚姻无效纠纷', tag: 'common' },
          { code: '5', name: '撤销婚姻纠纷', tag: 'common' },
          { code: '6', name: '夫妻财产约定纠纷', tag: 'common' },
          { code: '7', name: '同居关系子女抚养纠纷', tag: 'common' },
          { code: '8', name: '同居关系析产纠纷', tag: 'common' },
          { code: '9', name: '亲子关系纠纷', tag: 'common' },
          { code: '10', name: '赡养纠纷', tag: 'common' },
          { code: '11', name: '扶养纠纷', tag: 'common' },
          { code: '12', name: '抚养费纠纷', tag: 'common' },
          { code: '13', name: '扶养费纠纷', tag: 'common' },
          { code: '14', name: '监护权纠纷', tag: 'common' },
          { code: '15', name: '探望权纠纷', tag: 'common' },
          { code: '16', name: '收养关系纠纷', tag: 'common' },
          { code: '17', name: '分家析产纠纷', tag: 'common' },
          { code: '18', name: '法定继承纠纷', tag: 'common' },
          { code: '19', name: '遗嘱继承纠纷', tag: 'common' },
          { code: '20', name: '被继承人债务清偿纠纷', tag: 'common' },
          { code: '21', name: '遗赠纠纷', tag: 'common' },
          { code: '22', name: '遗赠扶养协议纠纷', tag: 'common' }
        ]
      },

      // 第三部分：物权纠纷
      {
        id: 3,
        code: '三',
        name: '物权纠纷',
        category: 'property',
        tag: 'property',
        desc: '《民法典》第二编',
        children: [
          { code: '1', name: '不动产登记纠纷', tag: 'common' },
          { code: '2', name: '物权保护纠纷', tag: 'common' },
          { code: '3', name: '所有权纠纷', tag: 'common' },
          { code: '4', name: '用益物权纠纷', tag: 'common' },
          { code: '5', name: '担保物权纠纷', tag: 'common' },
          { code: '6', name: '占有保护纠纷', tag: 'common' },
          { code: '7', name: '共有纠纷', tag: 'common' },
          { code: '8', name: '宅基地使用权纠纷', tag: 'common' }
        ]
      },

      // 第四部分：合同、准合同纠纷
      {
        id: 4,
        code: '四',
        name: '合同、准合同纠纷',
        category: 'contract',
        tag: 'contract',
        desc: '《民法典》第三编',
        children: [
          { code: '1', name: '缔约过失责任纠纷', tag: 'common' },
          { code: '2', name: '确认合同效力纠纷', tag: 'common' },
          { code: '3', name: '债权人代位权纠纷', tag: 'common' },
          { code: '4', name: '债权人撤销权纠纷', tag: 'common' },
          { code: '5', name: '债权转让合同纠纷', tag: 'common' },
          { code: '6', name: '债务转移合同纠纷', tag: 'common' },
          { code: '7', name: '债权债务概括转移合同纠纷', tag: 'common' },
          { code: '8', name: '买卖合同纠纷', tag: 'common' },
          { code: '9', name: '房地产开发经营合同纠纷', tag: 'common' },
          { code: '10', name: '房屋买卖合同纠纷', tag: 'common' },
          { code: '11', name: '房屋拆迁安置补偿合同纠纷', tag: 'common' },
          { code: '12', name: '供用电、水、气、热力合同纠纷', tag: 'common' },
          { code: '13', name: '赠与合同纠纷', tag: 'common' },
          { code: '14', name: '借款合同纠纷', tag: 'common' },
          { code: '15', name: '保证合同纠纷', tag: 'common' },
          { code: '16', name: '抵押合同纠纷', tag: 'common' },
          { code: '17', name: '质押合同纠纷', tag: 'common' },
          { code: '18', name: '定金合同纠纷', tag: 'common' },
          { code: '19', name: '租赁合同纠纷', tag: 'common' },
          { code: '20', name: '融资租赁合同纠纷', tag: 'common' },
          { code: '21', name: '保理合同纠纷', tag: 'common' },
          { code: '22', name: '承揽合同纠纷', tag: 'common' },
          { code: '23', name: '建设工程合同纠纷', tag: 'common' },
          { code: '24', name: '运输合同纠纷', tag: 'common' },
          { code: '25', name: '保管合同纠纷', tag: 'common' },
          { code: '26', name: '仓储合同纠纷', tag: 'common' },
          { code: '27', name: '委托合同纠纷', tag: 'common' },
          { code: '28', name: '物业服务合同纠纷', tag: 'common' },
          { code: '29', name: '行纪合同纠纷', tag: 'common' },
          { code: '30', name: '中介合同纠纷', tag: 'common' },
          { code: '31', name: '合伙合同纠纷', tag: 'common' },
          { code: '32', name: '服务合同纠纷', tag: 'common' },
          { code: '33', name: '演出合同纠纷', tag: 'common' },
          { code: '34', name: '劳务合同纠纷', tag: 'common' },
          { code: '35', name: '广告合同纠纷', tag: 'common' },
          { code: '36', name: '展览合同纠纷', tag: 'common' },
          { code: '37', name: '征收补偿合同纠纷', tag: 'common' },
          { code: '38', name: '无因管理纠纷', tag: 'common' },
          { code: '39', name: '不当得利纠纷', tag: 'common' }
        ]
      },

      // 第五部分：知识产权与竞争纠纷
      {
        id: 5,
        code: '五',
        name: '知识产权与竞争纠纷',
        category: 'ip',
        tag: 'ip',
        desc: '《著作权法》《商标法》《专利法》《反不正当竞争法》《反垄断法》',
        children: [
          { code: '1', name: '著作权合同纠纷', tag: 'common' },
          { code: '2', name: '商标权纠纷', tag: 'common' },
          { code: '3', name: '专利权纠纷', tag: 'common' },
          { code: '4', name: '植物新品种权纠纷', tag: 'common' },
          { code: '5', name: '集成电路布图设计纠纷', tag: 'common' },
          { code: '6', name: '垄断纠纷', tag: 'common' },
          { code: '7', name: '不正当竞争纠纷', tag: 'common' }
        ]
      },

      // 第六部分：数据、网络虚拟财产纠纷 ⭐ NEW
      {
        id: 6,
        code: '六',
        name: '数据、网络虚拟财产纠纷',
        category: 'data',
        tag: 'data',
        desc: '《民法典》第一百二十七条（2025年新增）',
        children: [
          { code: '199', name: '数据权属纠纷', tag: 'new' },
          { code: '200', name: '数据合同纠纷', tag: 'new' },
          { code: '201', name: '侵害数据权益纠纷', tag: 'new' },
          { code: '202', name: '网络虚拟财产权属纠纷', tag: 'new' },
          { code: '203', name: '网络虚拟财产合同纠纷', tag: 'new' },
          { code: '204', name: '侵害网络虚拟财产权益纠纷', tag: 'new' }
        ]
      },

      // 第七部分：劳动争议、人事争议、新就业形态用工纠纷
      {
        id: 7,
        code: '七',
        name: '劳动争议、人事争议、新就业形态用工纠纷',
        category: 'labor',
        tag: 'labor',
        desc: '《劳动法》《劳动合同法》《劳动争议调解仲裁法》',
        children: [
          { code: '171', name: '劳动合同纠纷', tag: 'common' },
          { code: '172', name: '社会保险纠纷', tag: 'common' },
          { code: '173', name: '工伤保险待遇纠纷', tag: 'common' },
          { code: '174', name: '福利待遇纠纷', tag: 'common' },
          { code: '175', name: '人事争议', tag: 'common' },
          { code: '176', name: '新就业形态用工纠纷', tag: 'new' }
        ]
      },

      // 第八部分：海事海商纠纷
      {
        id: 8,
        code: '八',
        name: '海事海商纠纷',
        category: 'maritime',
        tag: 'maritime',
        desc: '《海商法》《海事诉讼特别程序法》',
        children: [
          { code: '177', name: '船舶碰撞损害责任纠纷', tag: 'common' },
          { code: '178', name: '船舶污染损害责任纠纷', tag: 'common' },
          { code: '179', name: '海上、通海水域货物运输合同纠纷', tag: 'common' },
          { code: '180', name: '海上、通海水域旅客运输合同纠纷', tag: 'common' },
          { code: '181', name: '船舶租用合同纠纷', tag: 'common' },
          { code: '182', name: '海上保险合同纠纷', tag: 'common' }
        ]
      },

      // 第九部分：与公司、证券、保险、票据等有关的民事纠纷
      {
        id: 9,
        code: '九',
        name: '与公司、证券、保险、票据等有关的民事纠纷',
        category: 'corporate',
        tag: 'corporate',
        desc: '《公司法》《证券法》《保险法》《票据法》《破产法》',
        children: [
          { code: '183', name: '公司设立纠纷', tag: 'common' },
          { code: '184', name: '公司决议纠纷', tag: 'common' },
          { code: '185', name: '股东资格确认纠纷', tag: 'common' },
          { code: '186', name: '股东名册记载纠纷', tag: 'common' },
          { code: '187', name: '请求变更公司登记纠纷', tag: 'common' },
          { code: '188', name: '股东出资纠纷', tag: 'common' },
          { code: '189', name: '新增资本认购纠纷', tag: 'common' },
          { code: '190', name: '股东知情权纠纷', tag: 'common' },
          { code: '191', name: '请求公司收购股份纠纷', tag: 'common' },
          { code: '192', name: '股权转让纠纷', tag: 'common' },
          { code: '193', name: '公司决议纠纷', tag: 'common' },
          { code: '194', name: '公司解散纠纷', tag: 'common' },
          { code: '195', name: '证券权利确认纠纷', tag: 'common' },
          { code: '196', name: '证券交易代理合同纠纷', tag: 'common' },
          { code: '197', name: '证券虚假陈述责任纠纷', tag: 'common' },
          { code: '198', name: '保险合同纠纷', tag: 'common' }
        ]
      },

      // 第十部分：侵权责任纠纷
      {
        id: 10,
        code: '十',
        name: '侵权责任纠纷',
        category: 'tort',
        tag: 'tort',
        desc: '《民法典》第七编',
        children: [
          { code: '205', name: '机动车交通事故责任纠纷', tag: 'common' },
          { code: '206', name: '医疗损害责任纠纷', tag: 'common' },
          { code: '207', name: '产品责任纠纷', tag: 'common' },
          { code: '208', name: '高度危险责任纠纷', tag: 'common' },
          { code: '209', name: '饲养动物损害责任纠纷', tag: 'common' },
          { code: '210', name: '物件损害责任纠纷', tag: 'common' },
          { code: '211', name: '环境污染责任纠纷', tag: 'common' },
          { code: '212', name: '高度危险活动损害责任纠纷', tag: 'common' },
          { code: '213', name: '教育机构责任纠纷', tag: 'common' },
          { code: '214', name: '用人单位责任纠纷', tag: 'common' },
          { code: '215', name: '网络侵权责任纠纷', tag: 'new' }
        ]
      },

      // 第十一部分：非讼程序案件案由
      {
        id: 11,
        code: '十一',
        name: '非讼程序案件案由',
        category: 'nonlitigation',
        tag: 'procedure',
        desc: '《民事诉讼法》特别程序',
        children: [
          { code: '216', name: '申请宣告公民无民事行为能力、限制民事行为能力案件', tag: 'common' },
          { code: '217', name: '申请认定财产无主案件', tag: 'common' },
          { code: '218', name: '申请宣告失踪、宣告死亡案件', tag: 'common' },
          { code: '219', name: '申请确定监护人案件', tag: 'common' },
          { code: '220', name: '申请支付令案件', tag: 'common' }
        ]
      },

      // 第十二部分：特殊诉讼程序案件案由
      {
        id: 12,
        code: '十二',
        name: '特殊诉讼程序案件案由',
        category: 'nonlitigation',
        tag: 'procedure',
        desc: '《民事诉讼法》《企业破产法》',
        children: [
          { code: '221', name: '破产清算案件', tag: 'common' },
          { code: '222', name: '破产重整案件', tag: 'common' },
          { code: '223', name: '破产和解案件', tag: 'common' },
          { code: '224', name: '申请清算案件', tag: 'common' }
        ]
      }
    ]

    // 计算总数（包括子案由）
    let total = causes.length
    causes.forEach(cause => {
      if (cause.children) {
        total += cause.children.length
      }
    })

    this.setData({
      causes: causes,
      filteredCauses: causes,
      totalCauses: total
    })
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value.toLowerCase()
    this.setData({ searchKeyword: keyword })
    this.filterCauses()
  },

  /**
   * 选择分类Tab
   */
  selectTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ activeTab: index })
    this.filterCauses()
  },

  /**
   * 选择筛选标签
   */
  selectFilter(e) {
    const tag = e.currentTarget.dataset.tag
    this.setData({ filterTag: tag })
    this.filterCauses()
  },

  /**
   * 筛选案由
   */
  filterCauses() {
    const { causes, searchKeyword, activeTab, filterTag, categories } = this.data
    const category = categories[activeTab].id

    let filtered = causes

    // 按分类筛选
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category)
    }

    // 按标签筛选
    if (filterTag !== 'all') {
      filtered = filtered.map(item => {
        if (item.children && item.children.length > 0) {
          const filteredChildren = item.children.filter(child => {
            if (filterTag === 'common') {
              return child.tag === 'common'
            } else {
              return child.tag === filterTag
            }
          })
          return {
            ...item,
            children: filteredChildren
          }
        }
        return item
      }).filter(item => {
        // 如果标签匹配，或者有符合条件的子案由
        return item.tag === filterTag || (item.children && item.children.length > 0)
      })
    }

    // 按关键词搜索
    if (searchKeyword) {
      filtered = filtered.map(item => {
        if (item.children && item.children.length > 0) {
          const filteredChildren = item.children.filter(child =>
            child.name.toLowerCase().includes(searchKeyword) ||
            child.code.includes(searchKeyword)
          )
          return {
            ...item,
            children: filteredChildren
          }
        }
        return item
      }).filter(item => {
        // 如果一级案由匹配关键词，或者有符合条件的子案由
        return item.name.toLowerCase().includes(searchKeyword) ||
               item.code.includes(searchKeyword) ||
               (item.children && item.children.length > 0)
      })
    }

    this.setData({ filteredCauses: filtered })
  },

  /**
   * 显示案由详情
   */
  showCauseDetail(e) {
    const cause = e.currentTarget.dataset.cause
    this.setData({
      selectedCause: cause,
      showDetail: true
    })
  },

  /**
   * 隐藏详情弹窗
   */
  hideDetail() {
    this.setData({ showDetail: false })
  },

  /**
   * 阻止冒泡
   */
  stopPropagation() {
    // 阻止点击弹窗内容时关闭弹窗
  },

  /**
   * 返回首页
   */
  goBack() {
    wx.navigateBack({
      delta: 1,
      fail: () => {
        wx.switchTab({
          url: '/pages/home/home'
        })
      }
    })
  }
})
