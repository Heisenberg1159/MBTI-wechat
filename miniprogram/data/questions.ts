export interface Question {
  id: number
  dimension: 'EI' | 'SN' | 'TF' | 'JP'
  text: string
  optionA: { text: string; value: string }
  optionB: { text: string; value: string }
}

// 速测版：前28题（每维度7题）
const quickQuestions: Question[] = [
  // ===== E / I (1-7) =====
  { id: 1, dimension: 'EI', text: '周末到了，你更想怎么过？', optionA: { text: '约朋友出去逛逛', value: 'E' }, optionB: { text: '在家享受独处时光', value: 'I' } },
  { id: 2, dimension: 'EI', text: '在人群中待久了，你通常？', optionA: { text: '越聊越有精神', value: 'E' }, optionB: { text: '想找个安静的地方充电', value: 'I' } },
  { id: 3, dimension: 'EI', text: '遇到新环境，你倾向于？', optionA: { text: '主动和陌生人打招呼', value: 'E' }, optionB: { text: '先观察再慢慢融入', value: 'I' } },
  { id: 4, dimension: 'EI', text: '工作中你更喜欢？', optionA: { text: '团队协作，头脑风暴', value: 'E' }, optionB: { text: '独立思考，专注完成', value: 'I' } },
  { id: 5, dimension: 'EI', text: '朋友怎么形容你？', optionA: { text: '热情开朗，话很多', value: 'E' }, optionB: { text: '安静内敛，但聊得深', value: 'I' } },
  { id: 6, dimension: 'EI', text: '休闲时你更可能？', optionA: { text: '参加聚会或社交活动', value: 'E' }, optionB: { text: '看书、追剧或做手工', value: 'I' } },
  { id: 7, dimension: 'EI', text: '表达想法时你？', optionA: { text: '先说出来再想', value: 'E' }, optionB: { text: '想清楚了再说', value: 'I' } },

  // ===== S / N (8-14) =====
  { id: 8, dimension: 'SN', text: '你更关注？', optionA: { text: '当下的事实和细节', value: 'S' }, optionB: { text: '未来的可能和趋势', value: 'N' } },
  { id: 9, dimension: 'SN', text: '学习新东西你偏好？', optionA: { text: '按步骤实操，从具体到抽象', value: 'S' }, optionB: { text: '先理解原理，再举一反三', value: 'N' } },
  { id: 10, dimension: 'SN', text: '描述一件事你倾向于？', optionA: { text: '准确说出细节和数据', value: 'S' }, optionB: { text: '用比喻和联想来表达', value: 'N' } },
  { id: 11, dimension: 'SN', text: '解决问题时你？', optionA: { text: '参考过往经验，用验证过的方法', value: 'S' }, optionB: { text: '跳出框架，尝试全新思路', value: 'N' } },
  { id: 12, dimension: 'SN', text: '你更欣赏的人是？', optionA: { text: '务实可靠，脚踏实地', value: 'S' }, optionB: { text: '富有远见，敢想敢做', value: 'N' } },
  { id: 13, dimension: 'SN', text: '阅读时你更在意？', optionA: { text: '信息的准确性和实用性', value: 'S' }, optionB: { text: '文字背后的深层含义', value: 'N' } },
  { id: 14, dimension: 'SN', text: '对变化的态度？', optionA: { text: '变化带来风险，稳扎稳打更好', value: 'S' }, optionB: { text: '变化意味着机会，值得拥抱', value: 'N' } },

  // ===== T / F (15-21) =====
  { id: 15, dimension: 'TF', text: '做重要决定时你更依赖？', optionA: { text: '逻辑分析和客观数据', value: 'T' }, optionB: { text: '内心感受和对人的影响', value: 'F' } },
  { id: 16, dimension: 'TF', text: '朋友跟你诉苦，你第一反应？', optionA: { text: '帮他分析问题找解决方案', value: 'T' }, optionB: { text: '先共情，让他知道你理解', value: 'F' } },
  { id: 17, dimension: 'TF', text: '评价一个方案你更看重？', optionA: { text: '是否高效合理，能否落地', value: 'T' }, optionB: { text: '大家是否认同，气氛是否融洽', value: 'F' } },
  { id: 18, dimension: 'TF', text: '面对冲突你？', optionA: { text: '就事论事，坚持正确的立场', value: 'T' }, optionB: { text: '尽量调和，维护关系更重要', value: 'F' } },
  { id: 19, dimension: 'TF', text: '你认为好的管理者应该？', optionA: { text: '公平公正，用制度管人', value: 'T' }, optionB: { text: '关怀团队，以人为本', value: 'F' } },
  { id: 20, dimension: 'TF', text: '被批评时你？', optionA: { text: '理性判断批评是否合理', value: 'T' }, optionB: { text: '先感到受伤，再消化内容', value: 'F' } },
  { id: 21, dimension: 'TF', text: '选礼物时你更看重？', optionA: { text: '实用性和性价比', value: 'T' }, optionB: { text: '对方会多感动、多有心意', value: 'F' } },

  // ===== J / P (22-28) =====
  { id: 22, dimension: 'JP', text: '你的生活方式更接近？', optionA: { text: '有计划有清单，按部就班', value: 'J' }, optionB: { text: '随性自在，走一步看一步', value: 'P' } },
  { id: 23, dimension: 'JP', text: '旅行时你倾向于？', optionA: { text: '提前做好详细攻略', value: 'J' }, optionB: { text: '到了再看心情安排', value: 'P' } },
  { id: 24, dimension: 'JP', text: '对待截止日期？', optionA: { text: '尽早完成，绝不拖延', value: 'J' }, optionB: { text: '截止前冲刺，压力出灵感', value: 'P' } },
  { id: 25, dimension: 'JP', text: '你的桌面/房间通常？', optionA: { text: '整洁有序，物归原位', value: 'J' }, optionB: { text: '看起来乱但我知道东西在哪', value: 'P' } },
  { id: 26, dimension: 'JP', text: '做选择时你？', optionA: { text: '快速决定，定了就执行', value: 'J' }, optionB: { text: '多看看，保留更多可能性', value: 'P' } },
  { id: 27, dimension: 'JP', text: '项目推进你偏好？', optionA: { text: '明确分工和里程碑', value: 'J' }, optionB: { text: '灵活调整，边做边改', value: 'P' } },
  { id: 28, dimension: 'JP', text: '对规则你？', optionA: { text: '规则让事情更高效', value: 'J' }, optionB: { text: '规则是建议，可以变通', value: 'P' } },
]

// 完整版额外题目（29-60，每维度8题）
const extraQuestions: Question[] = [
  // ===== E / I (29-36) =====
  { id: 29, dimension: 'EI', text: '收到消息你通常？', optionA: { text: '立刻回复，保持互动', value: 'E' }, optionB: { text: '等有空再回，不急', value: 'I' } },
  { id: 30, dimension: 'EI', text: '团队讨论中你更可能？', optionA: { text: '积极发言，带动气氛', value: 'E' }, optionB: { text: '安静倾听，想好再提', value: 'I' } },
  { id: 31, dimension: 'EI', text: '你的社交圈？', optionA: { text: '广泛，认识很多人', value: 'E' }, optionB: { text: '小而深，几个知心好友', value: 'I' } },
  { id: 32, dimension: 'EI', text: '完成一个大项目后你？', optionA: { text: '找朋友庆祝分享喜悦', value: 'E' }, optionB: { text: '独自享受完成后的满足感', value: 'I' } },
  { id: 33, dimension: 'EI', text: '等人时你？', optionA: { text: '和旁边的人聊起来', value: 'E' }, optionB: { text: '刷手机或发呆', value: 'I' } },
  { id: 34, dimension: 'EI', text: '你更喜欢的工作节奏？', optionA: { text: '频繁沟通，实时同步', value: 'E' }, optionB: { text: '减少打扰，集中处理', value: 'I' } },
  { id: 35, dimension: 'EI', text: '你获取能量的方式？', optionA: { text: '和有趣的人在一起', value: 'E' }, optionB: { text: '安静的独处时光', value: 'I' } },
  { id: 36, dimension: 'EI', text: '面对压力你倾向？', optionA: { text: '找人倾诉，分散注意力', value: 'E' }, optionB: { text: '独处消化，自我调节', value: 'I' } },

  // ===== S / N (37-44) =====
  { id: 37, dimension: 'SN', text: '看电影你更享受？', optionA: { text: '精彩的画面和动作场面', value: 'S' }, optionB: { text: '隐喻和深层主题', value: 'N' } },
  { id: 38, dimension: 'SN', text: '你信任的是？', optionA: { text: '亲身验证过的事实', value: 'S' }, optionB: { text: '直觉告诉你的可能性', value: 'N' } },
  { id: 39, dimension: 'SN', text: '做一道菜你更可能？', optionA: { text: '严格按菜谱来', value: 'S' }, optionB: { text: '凭感觉自由发挥', value: 'N' } },
  { id: 40, dimension: 'SN', text: '你对哪种话题更感兴趣？', optionA: { text: '实用技能和操作方法', value: 'S' }, optionB: { text: '理论概念和思想实验', value: 'N' } },
  { id: 41, dimension: 'SN', text: '向别人解释事情你？', optionA: { text: '按步骤一步步讲清楚', value: 'S' }, optionB: { text: '先给全局框架再填细节', value: 'N' } },
  { id: 42, dimension: 'SN', text: '你对历史的兴趣在于？', optionA: { text: '具体事件和人物故事', value: 'S' }, optionB: { text: '历史规律和宏观趋势', value: 'N' } },
  { id: 43, dimension: 'SN', text: '买东西时你？', optionA: { text: '仔细对比参数和评价', value: 'S' }, optionB: { text: '凭直觉选感觉对的那款', value: 'N' } },
  { id: 44, dimension: 'SN', text: '你更容易注意到？', optionA: { text: '环境中的细微变化', value: 'S' }, optionB: { text: '别人话语中的弦外之音', value: 'N' } },

  // ===== T / F (45-52) =====
  { id: 45, dimension: 'TF', text: '看到朋友犯错你？', optionA: { text: '直接指出问题帮他改正', value: 'T' }, optionB: { text: '委婉提醒，怕伤他心', value: 'F' } },
  { id: 46, dimension: 'TF', text: '做团队决策时你更看重？', optionA: { text: '哪个方案数据更好', value: 'T' }, optionB: { text: '大家是否都认可', value: 'F' } },
  { id: 47, dimension: 'TF', text: '你觉得公平更重要还是和谐更重要？', optionA: { text: '公平，一码归一码', value: 'T' }, optionB: { text: '和谐，伤了感情难修补', value: 'F' } },
  { id: 48, dimension: 'TF', text: '评价一个人你首先看？', optionA: { text: '他的能力和成果', value: 'T' }, optionB: { text: '他的为人处世和态度', value: 'F' } },
  { id: 49, dimension: 'TF', text: '面对两难选择你？', optionA: { text: '列利弊清单，选综合最优', value: 'T' }, optionB: { text: '听听内心的声音', value: 'F' } },
  { id: 50, dimension: 'TF', text: '别人向你求助时你？', optionA: { text: '先判断求助是否合理', value: 'T' }, optionB: { text: '先答应再说，能帮就帮', value: 'F' } },
  { id: 51, dimension: 'TF', text: '工作中你更在意？', optionA: { text: '完成任务的质量和效率', value: 'T' }, optionB: { text: '过程中的体验和氛围', value: 'F' } },
  { id: 52, dimension: 'TF', text: '你觉得好的建议应该？', optionA: { text: '直击要害，哪怕不好听', value: 'T' }, optionB: { text: '顾及感受，温和表达', value: 'F' } },

  // ===== J / P (53-60) =====
  { id: 53, dimension: 'JP', text: '你的衣橱？', optionA: { text: '分类整理，一目了然', value: 'J' }, optionB: { text: '随心情搭配，有点乱', value: 'P' } },
  { id: 54, dimension: 'JP', text: '安排日程你？', optionA: { text: '有日历和提醒，严格执行', value: 'J' }, optionB: { text: '大致有数，不拘泥细节', value: 'P' } },
  { id: 55, dimension: 'JP', text: '对承诺你？', optionA: { text: '说到做到，绝不食言', value: 'J' }, optionB: { text: '尽量做到，但保留调整空间', value: 'P' } },
  { id: 56, dimension: 'JP', text: '同时进行多个项目你？', optionA: { text: '按优先级逐个完成', value: 'J' }, optionB: { text: '来回切换，哪有灵感做哪个', value: 'P' } },
  { id: 57, dimension: 'JP', text: '吃饭时你？', optionA: { text: '常去固定的几家店', value: 'J' }, optionB: { text: '总想尝试新地方', value: 'P' } },
  { id: 58, dimension: 'JP', text: '面对突发变化你？', optionA: { text: '迅速调整计划重新组织', value: 'J' }, optionB: { text: '顺其自然，随机应变', value: 'P' } },
  { id: 59, dimension: 'JP', text: '你觉得最好的工作状态？', optionA: { text: '结构清晰，步骤明确', value: 'J' }, optionB: { text: '自由开放，边探索边推进', value: 'P' } },
  { id: 60, dimension: 'JP', text: '假期结束你？', optionA: { text: '提前回来整理准备', value: 'J' }, optionB: { text: '玩到最后一刻再收心', value: 'P' } },
]

const fullQuestions = [...quickQuestions, ...extraQuestions]

export { quickQuestions, fullQuestions }
export default quickQuestions
