import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Mic,
  Plus,
  PieChart,
  BookHeart,
  BarChart3,
  Settings,
  X,
  Check,
  ArrowDownLeft,
  TrendingUp,
  Receipt,
  Camera,
  Trash2,
  Sparkles,
  CalendarRange,
  ChevronRight,
  ChevronLeft,
  Pencil,
  Calendar as CalendarIcon,
  Clock,
  Delete,
  Keyboard,
  AudioWaveform,
  RefreshCw,
  Edit3,
  Quote,
  Upload,
  Info,
  Calendar,
  AlertCircle,
  Smartphone
} from 'lucide-react';

// --- 注入全局样式 (修复 CSS 丢失问题) ---
const GlobalStyles = () => (
  <style>{`
    /* 隐藏滚动条但允许滚动 */
    .custom-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .custom-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    /* 动画定义 */
    @keyframes receipt-slide-down {
      0% { transform: translateY(-20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    .animate-receipt-slide-down {
      animation: receipt-slide-down 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    @keyframes fade-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    .animate-fade-in {
      animation: fade-in 0.3s ease-out forwards;
    }

    @keyframes slide-up {
      0% { transform: translateY(10px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    .animate-slide-up {
      animation: slide-up 0.4s ease-out forwards;
    }
  `}</style>
);

// --- 核心配置 ---
const STORAGE_KEY_PREFIX = 'warm_pixel_ledger_v_final_fixed_4';

// --- 名言警句库 ---
const QUOTES = [
  "俭，德之共也；侈，恶之大也。 ——《左传》",
  "成由勤俭破由奢。 ——《宋史·欧阳修传》",
  "惟俭能够养廉，惟勤可以补拙。 ——《朱子家训》",
  "静以修身，俭以养德。 ——诸葛亮《诫子书》",
  "节用裕民，慎器使物。 ——《礼记》",
  "取之有度，用之有节。 ——《资治通鉴》",
  "历览前贤国与家，成由勤俭破由奢。 ——李商隐",
  "奢者易贫，俭者易富。 ——《明鉴纲目》",
  "一粥一饭，当思来处不易。 ——《朱子家训》",
  "居安思危，戒奢以俭。 ——《后汉书》",
  "储蓄是为了在未来拥有更多选择。 ——苏珊·奥曼",
  "不要花你没有的钱。 ——托马斯·杰斐逊",
  "节俭本身就是一种收入。 ——塞涅卡",
  "富人买资产，穷人买负债。 ——罗伯特·清崎",
  "你必须掌控金钱，否则金钱会掌控你。 ——戴夫·拉姆齐",
  "自律即自由。 ——乔科·威林克",
  "投资自己，永远不会亏。 ——巴菲特",
  "复利是世界第八大奇迹。 ——爱因斯坦",
  "花钱之前先问问：我真的需要它吗？ ——陈安之",
  "成功就是每天进步一点点。 ——约翰·麦克斯韦",
  "节制消费比增加收入更重要。 ——本杰明·富兰克林",
  "省一元钱比赚一元钱更容易。 ——约翰·洛克菲勒",
  "能省会花，才是真聪明。 ——亨利·福特",
  "预算是告诉钱往哪里去。 ——戴夫·拉姆齐",
  "富有来自习惯，而非运气。 ——托尼·罗宾斯",
  "花掉剩下的，存下赚来的？不，反过来。 ——巴菲特",
  "控制开支是致富的根本。 ——乔治·克拉森",
  "财富不是你赚多少，而是你留住多少。 ——乔治·克拉森",
  "先支付给自己。 ——《巴比伦最富有的人》",
  "别让消费变成负担。 ——雷·达里奥",
  "节俭是天然的财富。 ——《伊索寓言》",
  "钱能买到的幸福很有限。 ——梭罗《瓦尔登湖》",
  "宁静的生活最富有。 ——托尔斯泰",
  "欲望越少，生活越富。 ——《沉思录》",
  "简单就是最大的财富。 ——托尔斯泰",
  "凡事预则立。 ——《礼记·中庸》",
  "最好的财富是智慧。 ——《箴言》",
  "积土成山，积水成渊。 ——《荀子》",
  "节俭是美德，而奢侈则是恶习。 ——《伊索寓言》",
  "忍一时，省一年。 ——民间俗语",
  "把控自己，生活才不会失控。 ——詹姆斯·克利尔",
  "习惯决定命运。 ——萨缪尔·斯迈尔斯",
  "管理时间，就是管理人生。 ——彼得·德鲁克",
  "先管理自己，再管理财富。 ——史蒂芬·柯维",
  "未来由今天的选择构成。 ——《高效能人士的七个习惯》",
  "自律让你变得强大。 ——詹姆斯·克利尔",
  "一个人要么受节制的苦，要么受贫穷的苦。 ——吉姆·罗恩",
  "今天的克制换来明天的自由。 ——戴夫·拉姆齐",
  "想清楚，再花钱。 ——理财金句",
  "你不是为钱工作，而是让钱为你工作。 ——罗伯特·清崎"
];

// --- 风格配置 ---
const THEME = {
  border: "border-4 border-[#5e4b35]",
  shadow: "shadow-[4px_4px_0_0_#c2a58d]",
  shadowHover: "shadow-[6px_6px_0_0_#c2a58d]",
  bg: "bg-[#fff9f0]",
  text: "text-[#4a3b2a]",
  textLight: "text-[#8d7b68]",
};

const PIXEL_BTN = `${THEME.border} ${THEME.shadow} active:translate-y-1 active:shadow-none transition-all duration-200`;

// --- 锯齿边缘样式 ---
const JAG_TOP = {
  backgroundImage: "linear-gradient(45deg, transparent 50%, white 50%), linear-gradient(135deg, white 50%, transparent 50%)",
  backgroundPosition: "bottom",
  backgroundSize: "16px 16px",
  backgroundRepeat: "repeat-x",
  height: "16px",
  width: "100%",
  position: "absolute",
  top: "-16px",
  left: "0",
  zIndex: 1
};

const JAG_BOTTOM = {
  backgroundImage: "radial-gradient(circle, transparent 50%, white 50%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "top",
  height: "16px",
  width: "100%",
  position: "absolute",
  bottom: "-16px",
  left: "0",
  zIndex: 1,
  transform: "rotate(180deg)"
};

const COLOR_PALETTE = [
  '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#fffffc', '#d4d4d4'
];

const DEFAULT_CATEGORIES = {
  expense: [
    { id: 'meals', name: '一日三餐', icon: '🥘', color: '#ffadad', keywords: ['饭', '餐', '吃', '饿', '面', '粉', '外卖', '肯德基', '麦当劳', '午饭', '晚饭', '早餐'] },
    { id: 'snacks', name: '零食饮料', icon: '🧋', color: '#ffd6a5', keywords: ['水', '奶茶', '咖啡', '茶', '零食', '蛋糕', '甜点'] },
    { id: 'transport', name: '交通出行', icon: '🚋', color: '#fdffb6', keywords: ['车', '地铁', '公交', '油', '停', '路费', '机票'] },
    { id: 'shopping', name: '日常购物', icon: '🛒', color: '#caffbf', keywords: ['买', '超市', '日用', '纸', '牙膏'] },
    { id: 'clothes', name: '服饰美妆', icon: '👒', color: '#9bf6ff', keywords: ['衣', '裤', '鞋', '袜', '妆', '护肤'] },
    { id: 'housing', name: '房租水电', icon: '🏡', color: '#a0c4ff', keywords: ['房', '电', '水费', '宽带', '话费'] },
    { id: 'digital', name: '数码家电', icon: '🎧', color: '#bdb2ff', keywords: ['电脑', '手机', '游戏', '会员', '电器'] },
    { id: 'entertainment', name: '休闲娱乐', icon: '🍿', color: '#ffc6ff', keywords: ['玩', '电影', 'KTV', '唱', '游'] },
    { id: 'medical', name: '医疗健康', icon: '🩹', color: '#fffffc', keywords: ['药', '医', '病', '体检'] },
    { id: 'education', name: '学习进修', icon: '📒', color: '#e5e5e5', keywords: ['书', '课', '学'] },
    { id: 'pets', name: '宠物喵汪', icon: '🐾', color: '#ffadad', keywords: ['猫', '狗', '粮', '宠'] },
    { id: 'other', name: '其他支出', icon: '🌀', color: '#d4d4d4', keywords: [] },
  ],
  income: [
    { id: 'salary', name: '工资薪水', icon: '💴', color: '#9bf6ff', keywords: ['工资', '薪', '发'] },
    { id: 'bonus', name: '奖金福利', icon: '🧧', color: '#ffc6ff', keywords: ['奖', '红包'] },
    { id: 'parttime', name: '兼职副业', icon: '🔨', color: '#ffd6a5', keywords: ['兼职', '副业'] },
    { id: 'investment', name: '理财收益', icon: '📈', color: '#caffbf', keywords: ['股', '基', '息'] },
    { id: 'gift', name: '收到红包', icon: '🎁', color: '#ffadad', keywords: [] },
  ]
};

// --- 工具函数 ---
const formatMoney = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '¥0.00';
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(num);
};

const formatDateForInput = (isoString) => {
  const d = new Date(isoString);
  const pad = (n) => n < 10 ? '0' + n : n;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const getEmotionMessage = (amount, categoryName, type) => {
  if (type === 'income') {
    if (amount > 10000) return "财神爷附体！🤑";
    return "积少成多，快乐加倍！💰";
  }

  if (categoryName.includes('宠物') || categoryName.includes('猫') || categoryName.includes('狗')) return "给毛孩子的爱，永远不嫌多 🐾";
  if (categoryName.includes('数码') || categoryName.includes('电器') || categoryName.includes('手机')) return "科技改变生活，早买早享受 ⚡️";
  if (categoryName.includes('餐') || categoryName.includes('食') || categoryName.includes('饭')) return "吃饱了才有力气生活！😋";
  if (categoryName.includes('零食') || categoryName.includes('奶茶')) return "一点点甜，治愈一整天 🍬";
  if (categoryName.includes('衣') || categoryName.includes('饰') || categoryName.includes('妆')) return "新衣服是自信的战袍 👗";
  if (categoryName.includes('住') || categoryName.includes('房') || categoryName.includes('电费')) return "家的温暖，是无可替代的港湾 🏠";
  if (categoryName.includes('行') || categoryName.includes('车') || categoryName.includes('油')) return "在路上，遇见更好的风景 🚀";
  if (categoryName.includes('医') || categoryName.includes('药')) return "身体健康是最大的财富 💪";
  if (categoryName.includes('学') || categoryName.includes('书')) return "投资自己，永远稳赚不赔 📚";
  if (categoryName.includes('玩') || categoryName.includes('乐')) return "快乐无价，给心情放个假 🎉";

  if (amount > 2000) return "虽然贵，但快乐无价！💎";

  return "你的生活，独一无二 📝";
};

// --- 核心：中文数字转阿拉伯数字 ---
const parseAmountFromVoice = (text) => {
  if (!text) return '';

  let cleanText = text
    .replace(/元/g, '')
    .replace(/钱/g, '')
    .replace(/人民币/g, '')
    .replace(/块/g, '.')
    .replace(/点/g, '.')
    .replace(/毛/g, '');

  const arabicMatch = cleanText.match(/(\d+(\.\d+)?)/);
  if (arabicMatch) return parseFloat(arabicMatch[0]);

  const cnNums = { '零': 0, '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10, '百': 100, '千': 1000, '万': 10000 };
  const cnMatch = cleanText.match(/[零一二两三四五六七八九十百千万]+/);
  if (!cnMatch) return '';

  const cnStr = cnMatch[0];
  let result = 0;
  let tempUnit = 1;
  let tempNum = 0;

  for (let i = 0; i < cnStr.length; i++) {
    const char = cnStr[i];
    const val = cnNums[char];

    if (val >= 10) {
      if (tempNum === 0) tempNum = 1;
      result += tempNum * val;
      tempNum = 0;
    } else {
      tempNum = val;
    }
  }
  result += tempNum;
  return result > 0 ? result : '';
};

// --- 智能日期解析 ---
const parseDateFromVoice = (text) => {
  const now = new Date();
  let resultDate = new Date(now);

  if (text.includes('昨天')) resultDate.setDate(now.getDate() - 1);
  else if (text.includes('前天')) resultDate.setDate(now.getDate() - 2);

  const monthDateMatch = text.match(/(\d{1,2})[月\.](\d{1,2})[日号]/);
  if (monthDateMatch) {
    resultDate.setMonth(parseInt(monthDateMatch[1]) - 1);
    resultDate.setDate(parseInt(monthDateMatch[2]));
  } else {
    const dateMatch = text.match(/(\d{1,2})[日号]/);
    if (dateMatch) {
      const day = parseInt(dateMatch[1]);
      if (day <= 31) resultDate.setDate(day);
    }
  }

  if (text.includes('早上') || text.includes('上午')) resultDate.setHours(8, 0, 0, 0);
  else if (text.includes('中午')) resultDate.setHours(12, 0, 0, 0);
  else if (text.includes('晚上')) resultDate.setHours(19, 0, 0, 0);
  else if (text.includes('下午')) resultDate.setHours(15, 0, 0, 0);

  return resultDate;
};

const safeCalculate = (expression) => {
  try {
    if (/[^0-9+\-*/.]/.test(expression)) return parseFloat(expression);
    if (!isNaN(parseFloat(expression)) && !/[+\-*/]/.test(expression)) return parseFloat(expression);
    // eslint-disable-next-line no-new-func
    return new Function('return ' + expression)();
  } catch (e) {
    return parseFloat(expression) || 0;
  }
};

// --- 图片压缩工具 ---
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    };
  });
};

// --- 组件 ---
const TypewriterText = ({ text, speed = 30, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayText('');
    const timer = setInterval(() => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span>{displayText}</span>;
};

const LineChart = ({ data, color = "#ffadad" }) => {
  if (!data || data.length < 2) return (
    <div className="flex flex-col items-center justify-center h-[180px] text-[#8d7b68] text-xs gap-2 bg-[#fffcf5] rounded-xl border-2 border-dashed border-[#e6dccb]">
      <TrendingUp size={24} className="opacity-50" />
      <span>积累数据中... 📉</span>
    </div>
  );

  const height = 180;
  const width = 320;
  const padding = 24;
  const bottomPadding = 30;
  const maxVal = Math.max(...data.map(d => d.value)) * 1.2 || 100;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - bottomPadding - (d.value / maxVal) * (height - bottomPadding - padding);
    return `${x},${y}`;
  }).join(' ');

  const fillPath = `
    ${padding},${height - bottomPadding} 
    ${points} 
    ${width - padding},${height - bottomPadding}
  `;

  return (
    <div className={`w-full overflow-hidden bg-white p-4 rounded-xl ${THEME.border} relative shadow-sm`}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <line x1={padding} y1={height - bottomPadding} x2={width - padding} y2={height - bottomPadding} stroke="#eee" strokeWidth="2" />
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#eee" strokeWidth="2" strokeDasharray="4 4" />
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={fillPath} fill={`url(#gradient-${color})`} />
        <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
          const y = height - bottomPadding - (d.value / maxVal) * (height - bottomPadding - padding);
          const showLabel = i === 0 || i === data.length - 1 || (data.length > 10 ? i % 3 === 0 : true);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="3" fill="#fff" stroke={color} strokeWidth="2" />
              {showLabel && <text x={x} y={height - 10} fontSize="9" textAnchor="middle" fill="#8d7b68" fontWeight="bold">{d.label}</text>}
              {d.value > 0 && showLabel && <text x={x} y={y - 8} fontSize="8" textAnchor="middle" fill={color} fontWeight="bold">{d.value >= 1000 ? (d.value / 1000).toFixed(1) + 'k' : d.value}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const CalculatorKeypad = ({ onKeyPress, onDelete, onConfirm }) => {
  const keys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '.', '0', 'DEL', '+'];
  return (
    <div className="bg-[#f0e6d2] p-3 rounded-xl border-t-4 border-[#5e4b35] animate-slide-up">
      <div className="grid grid-cols-4 gap-2">
        {keys.map(key => (
          <button key={key} onClick={() => key === 'DEL' ? onDelete() : onKeyPress(key)} className={`h-12 rounded-lg font-bold text-lg shadow-sm active:translate-y-0.5 active:shadow-none transition-all ${['/', '*', '-', '+'].includes(key) ? 'bg-[#ffadad] text-[#5e4b35]' : 'bg-white text-[#4a3b2a]'} ${key === 'DEL' ? 'bg-[#e5e5e5] text-red-500' : ''}`}>
            {key === 'DEL' ? <Delete size={20} className="mx-auto" /> : key}
          </button>
        ))}
        <button onClick={onConfirm} className="col-span-4 bg-[#5e4b35] text-white h-12 rounded-lg font-black text-lg shadow-md active:translate-y-0.5 active:shadow-none mt-1">完成</button>
      </div>
    </div>
  );
};

const QuoteModal = ({ onClose, quote }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 transition-opacity duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
      <div className={`bg-white/90 w-full max-w-sm rounded-2xl p-8 text-center relative shadow-2xl backdrop-blur-md border border-white/50 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-10 opacity-0'}`} onClick={e => e.stopPropagation()}>
        <Quote size={32} className="text-stone-300 mb-6 mx-auto" />
        <div className="text-lg font-medium text-[#4a3b2a] mb-8 leading-loose font-serif tracking-wide">{quote}</div>
        <div className="w-12 h-1 bg-[#5e4b35]/10 mx-auto rounded-full mb-6"></div>
        <button onClick={handleClose} className="text-xs text-[#8d7b68] font-bold hover:text-[#5e4b35] transition-colors tracking-widest uppercase">Close</button>
      </div>
    </div>
  );
};

// --- 预算设置Modal ---
function BudgetModal({ initialValue, onClose, onSave }) {
  const [val, setVal] = useState(initialValue);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white w-72 p-6 rounded-2xl border-4 border-[#5e4b35] shadow-xl text-center" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-black text-[#4a3b2a] mb-4">设定月度预算</h3>
        <div className="flex items-center border-b-4 border-[#5e4b35] bg-[#fffaf5] p-2 mb-6">
          <span className="text-xl font-bold text-[#4a3b2a] mr-2">¥</span>
          <input
            type="number"
            value={val}
            onChange={e => setVal(e.target.value)}
            className="w-full bg-transparent text-2xl font-mono font-bold outline-none text-[#4a3b2a]"
            autoFocus
          />
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg font-bold text-[#8d7b68] hover:bg-[#eee]">取消</button>
          <button onClick={() => onSave(Number(val))} className="flex-1 py-2 rounded-lg bg-[#5e4b35] text-white font-bold shadow-md active:translate-y-1 transition-all">确认</button>
        </div>
      </div>
    </div>
  )
}

// --- 删除确认Modal ---
function DeleteConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white w-72 p-6 rounded-2xl border-4 border-red-500 shadow-xl text-center" onClick={e => e.stopPropagation()}>
        <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-black text-[#4a3b2a] mb-2">删除记录?</h3>
        <p className="text-sm text-[#8d7b68] mb-6">这条美好的生活印记将永远消失，确定吗？</p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg font-bold text-[#8d7b68] hover:bg-[#eee]">再想想</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-red-500 text-white font-bold shadow-md active:translate-y-1 transition-all">确认删除</button>
        </div>
      </div>
    </div>
  );
}

// --- 主应用 ---
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [budget, setBudget] = useState(5000);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const [avatar, setAvatar] = useState("https://api.dicebear.com/7.x/notionists/svg?seed=Felix");

  // const [recordCount, setRecordCount] = useState(0);
  // const [showQuote, setShowQuote] = useState(false);
  // const [currentQuote, setCurrentQuote] = useState("");
  // const [showBudgetModal, setShowBudgetModal] = useState(false);

  // useEffect(() => {
  //   const savedTx = localStorage.getItem(`${STORAGE_KEY_PREFIX}_tx`);
  //   if (savedTx) setTransactions(JSON.parse(savedTx));
  //   else setTransactions([
  //     { id: 1, amount: 45.5, category: '一日三餐', type: 'expense', note: '和同事吃午饭', date: new Date().toISOString(), emotionNote: "吃饱饱，没烦恼！😋" },
  //     { id: 2, amount: 158.0, category: '日常购物', type: 'expense', note: '超市大采购', date: new Date(Date.now() - 86400000).toISOString(), emotionNote: "把冰箱填满真幸福 🍎" },
  //   ]);

  //   const savedCats = localStorage.getItem(`${STORAGE_KEY_PREFIX}_cats`);
  //   if (savedCats) setCategories(JSON.parse(savedCats));

  //   const savedAvatar = localStorage.getItem(`${STORAGE_KEY_PREFIX}_avatar`);
  //   if (savedAvatar) setAvatar(savedAvatar);

  //   const savedCount = localStorage.getItem(`${STORAGE_KEY_PREFIX}_count`);
  //   if (savedCount) setRecordCount(parseInt(savedCount));

  //   const savedBudget = localStorage.getItem(`${STORAGE_KEY_PREFIX}_budget`);
  //   if (savedBudget) setBudget(Number(savedBudget));
  // }, []);

  // useEffect(() => {
  //   try {
  //       localStorage.setItem(`${STORAGE_KEY_PREFIX}_tx`, JSON.stringify(transactions));
  //   } catch (e) {
  //       alert("存储空间不足，请清理一些带图的记录");
  //   }
  // }, [transactions]);

  // useEffect(() => {
  //   localStorage.setItem(`${STORAGE_KEY_PREFIX}_cats`, JSON.stringify(categories));
  // }, [categories]);

  // useEffect(() => {
  //   localStorage.setItem(`${STORAGE_KEY_PREFIX}_avatar`, avatar);
  // }, [avatar]);

  // useEffect(() => {
  //   localStorage.setItem(`${STORAGE_KEY_PREFIX}_count`, recordCount.toString());
  // }, [recordCount]);

  // useEffect(() => {
  //   localStorage.setItem(`${STORAGE_KEY_PREFIX}_budget`, budget.toString());
  // }, [budget]);

  // ... 前面是 useState 的定义 ...
  const [recordCount, setRecordCount] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  // 1. 新增：加一把“安全锁”，默认是锁住的 (false)
  const [isLoaded, setIsLoaded] = useState(false);

  // --- 核心修改：读取数据 (只在启动时运行一次) ---
  useEffect(() => {
    // 读取交易记录
    const savedTx = localStorage.getItem(`${STORAGE_KEY_PREFIX}_tx`);
    if (savedTx) {
      setTransactions(JSON.parse(savedTx));
    } else {
      // 如果没有存档，才加载默认数据
      setTransactions([
        { id: 1, amount: 45.5, category: '一日三餐', type: 'expense', note: '和同事吃午饭', date: new Date().toISOString(), emotionNote: "吃饱饱，没烦恼！😋" },
        { id: 2, amount: 158.0, category: '日常购物', type: 'expense', note: '超市大采购', date: new Date(Date.now() - 86400000).toISOString(), emotionNote: "把冰箱填满真幸福 🍎" },
      ]);
    }

    // 读取其他配置
    const savedCats = localStorage.getItem(`${STORAGE_KEY_PREFIX}_cats`);
    if (savedCats) setCategories(JSON.parse(savedCats));

    const savedAvatar = localStorage.getItem(`${STORAGE_KEY_PREFIX}_avatar`);
    if (savedAvatar) setAvatar(savedAvatar);

    const savedCount = localStorage.getItem(`${STORAGE_KEY_PREFIX}_count`);
    if (savedCount) setRecordCount(parseInt(savedCount));

    const savedBudget = localStorage.getItem(`${STORAGE_KEY_PREFIX}_budget`);
    if (savedBudget) setBudget(Number(savedBudget));

    // 2. 关键：所有数据读完了，解开“安全锁”
    setIsLoaded(true);
  }, []);

  // --- 核心修改：自动保存 (只有锁解开了才允许保存) ---
  useEffect(() => {
    // 3. 关键判断：如果还没读完档，绝对不要保存！
    if (!isLoaded) return;

    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_tx`, JSON.stringify(transactions));
    } catch (e) {
      // 存储满的时候给个提示，不崩坏
      console.error("Storage full");
    }
  }, [transactions, isLoaded]); // 依赖项里加上 isLoaded

  // 下面这些保存逻辑也都要加锁
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_cats`, JSON.stringify(categories));
  }, [categories, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_avatar`, avatar);
  }, [avatar, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_count`, recordCount.toString());
  }, [recordCount, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_budget`, budget.toString());
  }, [budget, isLoaded]);

  // ... 后面接着原来的 handleAvatarUpload ...

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await compressImage(file);
      setAvatar(compressed);
    }
  };

  const addTransaction = (t) => {
    setTransactions([t, ...transactions]);
    const newCount = recordCount + 1;
    setRecordCount(newCount);
    if (newCount > 0 && newCount % 5 === 0) {
      const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setCurrentQuote(randomQuote);
      setTimeout(() => setShowQuote(true), 1000);
    }
  };

  const updateTransaction = (updatedTx) => {
    setTransactions(transactions.map(t => t.id === updatedTx.id ? updatedTx : t));
  };

  const handleDeleteRequest = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setTransactions(transactions.filter(t => t.id !== itemToDelete));
      setItemToDelete(null);
      setShowDeleteModal(false);
      setShowModal(false);
    }
  };

  const handleSaveBudget = (val) => {
    if (!isNaN(val)) setBudget(val);
    setShowBudgetModal(false);
  };

  const addCategory = (type, newCat) => {
    setCategories(prev => ({ ...prev, [type]: [...prev[type], newCat] }));
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const openEditModal = (tx) => {
    setEditingTransaction(tx);
    setShowModal(true);
  };

  return (
    <div className={`min-h-screen ${THEME.bg} ${THEME.text} font-mono overflow-hidden relative selection:bg-[#ffadad] selection:text-white`}>
      <GlobalStyles />
      <div className="fixed top-[-5%] left-[-10%] w-[50%] h-[50%] bg-[#fff0db] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="fixed bottom-[-5%] right-[-10%] w-[50%] h-[50%] bg-[#ffe5d9] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="h-2 w-full fixed top-0 z-50 bg-[#fff9f0]/80 backdrop-blur-sm"></div>

      <div className="pb-24 pt-4 px-5 h-screen overflow-y-auto custom-scrollbar relative z-10 max-w-md mx-auto bg-[#fff9f0] shadow-2xl border-x-4 border-[#5e4b35]/10">
        {activeTab === 'home' && (
          <HomeView
            transactions={transactions}
            budget={budget}
            setBudget={setBudget}
            categories={categories}
            onEdit={openEditModal}
            avatar={avatar}
            onAvatarChange={handleAvatarUpload}
            onOpenBudgetModal={() => setShowBudgetModal(true)}
          />
        )}
        {activeTab === 'stats' && (
          <StatsView transactions={transactions} categories={categories} />
        )}
      </div>

      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <nav className={`pointer-events-auto bg-[#fffaf5] ${THEME.border} ${THEME.shadow} px-8 py-2 flex justify-between items-center rounded-2xl w-[90%] max-w-[360px]`}>
          <NavIcon icon={BookHeart} label="生活" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <div className="relative -top-8">
            <button
              onClick={openAddModal}
              className={`w-16 h-16 bg-[#ffadad] ${PIXEL_BTN} rounded-2xl flex items-center justify-center hover:bg-[#ff9999]`}
            >
              <Plus size={32} className="text-[#5e4b35]" strokeWidth={3} />
            </button>
          </div>
          <NavIcon icon={BarChart3} label="统计" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
        </nav>
      </div>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSave={editingTransaction ? updateTransaction : addTransaction}
          onDelete={handleDeleteRequest}
          initialData={editingTransaction}
          categories={categories}
          onAddCategory={addCategory}
        />
      )}

      {showQuote && (
        <QuoteModal onClose={() => setShowQuote(false)} quote={currentQuote} />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}

      {showBudgetModal && (
        <BudgetModal
          initialValue={budget}
          onClose={() => setShowBudgetModal(false)}
          onSave={handleSaveBudget}
        />
      )}
    </div>
  );
}

// --- 首页 ---
function HomeView({ transactions, budget, setBudget, categories, onEdit, avatar, onAvatarChange, onOpenBudgetModal }) {
  const [filterDate, setFilterDate] = useState(new Date());
  const [filterType, setFilterType] = useState('month');
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);

  const now = new Date();
  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalExpense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const budgetRemaining = Math.max(0, budget - totalExpense);
  const budgetProgress = Math.min((totalExpense / budget) * 100, 100);
  const isOverBudget = totalExpense > budget;
  const monthlyBalance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    if (filterType === 'day') {
      return d.getDate() === filterDate.getDate() && d.getMonth() === filterDate.getMonth() && d.getFullYear() === filterDate.getFullYear();
    } else {
      return d.getMonth() === filterDate.getMonth() && d.getFullYear() === filterDate.getFullYear();
    }
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const changeMonth = (offset) => {
    const newDate = new Date(filterDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setFilterDate(newDate);
    setFilterType('month');
  };

  const handleDatePick = (e) => {
    if (e.target.value) {
      setFilterDate(new Date(e.target.value));
      setFilterType('day');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pt-4">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className={`text-3xl font-black ${THEME.text} flex items-center gap-2 tracking-tight`}>
            <span className="text-4xl">📒</span>
            <span>小菜手账</span>
          </h1>
          {/* 文案修改 */}
          <p className={`${THEME.textLight} text-xs font-bold mt-1 tracking-wide`}>我的生活，独一无二，值得一记。</p>
        </div>
        <div
          className={`w-12 h-12 ${THEME.border} bg-[#fff] rounded-full flex items-center justify-center shadow-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group`}
          onClick={() => fileInputRef.current.click()}
        >
          <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center">
            <Edit3 size={16} className="text-white" />
          </div>
          <input type="file" ref={fileInputRef} onChange={onAvatarChange} className="hidden" accept="image/*" />
        </div>
      </header>

      {/* 概览卡片 */}
      <div className={`bg-[#fff] rounded-2xl p-6 relative overflow-hidden group ${THEME.border} ${THEME.shadow}`}>
        {/* 预算设置按钮 (右上角) */}
        <button
          className={`absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#f0e6d2] text-[#8d7b68] transition-colors z-20`}
          onClick={onOpenBudgetModal}
        >
          <Settings size={18} strokeWidth={2.5} />
        </button>

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <span className={`${THEME.textLight} text-sm font-bold block mb-1`}>本月支出</span>
            <div className={`text-5xl font-black ${THEME.text} tracking-tight`}>{formatMoney(totalExpense)}</div>
          </div>
          {isOverBudget && (
            <div className="flex items-center gap-1 bg-[#ffadad] text-[#5e4b35] px-3 py-1.5 rounded-lg border-2 border-[#5e4b35] text-xs font-bold animate-bounce">
              ⚠️ 预算超支
            </div>
          )}
        </div>

        <div className="space-y-2 relative z-10 mb-6">
          <div className={`flex justify-between text-xs font-bold ${THEME.textLight}`}>
            {/* 整个区域可点击以设置预算 */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-[#5e4b35] transition-colors group"
              onClick={onOpenBudgetModal}
            >
              <span>预算剩余: {formatMoney(budgetRemaining)}</span>
              <Pencil size={12} className="opacity-50 group-hover:opacity-100" />
            </div>
            <span>已用: {Math.round(budgetProgress)}%</span>
          </div>
          <div
            className={`h-5 w-full bg-[#f0e6d2] ${THEME.border} rounded-full p-0.5 relative overflow-hidden cursor-pointer`}
            onClick={onOpenBudgetModal}
          >
            <div className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-[#ffadad]' : 'bg-[#caffbf]'}`} style={{ width: `${budgetProgress}%` }} />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t-2 border-[#5e4b35]/20 border-dashed relative z-10">
          <div className="flex gap-4 w-full justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8d7b68] font-bold">本月收入</span>
              <span className={`text-sm font-black ${THEME.text}`}>{formatMoney(totalIncome)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[#8d7b68] font-bold">本月结余</span>
              <span className={`text-sm font-black ${monthlyBalance >= 0 ? 'text-[#48BB78]' : 'text-red-500'}`}>{formatMoney(monthlyBalance)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 生活印记列表 */}
      <div>
        <div className="flex items-center justify-between mb-5 pl-2 border-l-4 border-[#5e4b35]">
          <h3 className={`text-xl font-black ${THEME.text} flex items-center gap-2`}>
            <Sparkles size={20} className="text-[#ffadad]" /> 生活印记
          </h3>

          {/* 日期筛选器 */}
          <div className="flex items-center gap-2 bg-[#fff] border-2 border-[#5e4b35] rounded-lg px-1 py-1 shadow-sm">
            <button onClick={() => changeMonth(-1)} className="hover:bg-[#eee] rounded p-0.5"><ChevronLeft size={16} className={THEME.text} /></button>

            <div className="relative flex items-center justify-center cursor-pointer hover:bg-[#fff9f0] rounded px-1">
              <span className="text-xs font-bold font-mono text-[#4a3b2a] text-center">
                {filterType === 'day'
                  ? `${filterDate.getMonth() + 1}.${filterDate.getDate()}`
                  : `${filterDate.getFullYear()}.${filterDate.getMonth() + 1 < 10 ? '0' + (filterDate.getMonth() + 1) : filterDate.getMonth() + 1}`
                }
              </span>
              <Calendar size={12} className="ml-1 text-[#8d7b68]" />
              <input
                type="date"
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                onChange={handleDatePick}
              />
            </div>

            <button onClick={() => changeMonth(1)} disabled={filterDate >= new Date()} className="hover:bg-[#eee] rounded p-0.5 disabled:opacity-30"><ChevronRight size={16} className={THEME.text} /></button>
          </div>
        </div>

        <div className="space-y-6 pb-20">
          {filteredTransactions.length === 0 ? (
            <div className={`text-center py-12 bg-white ${THEME.border} rounded-xl border-dashed ${THEME.textLight}`}>
              <div className="text-5xl mb-3">🍃</div>
              <p className="font-bold text-sm">
                {filterType === 'day' ? '这一天没有记录哦' : '本月还没有记录哦'}
              </p>
              {filterType === 'day' && <button onClick={() => setFilterType('month')} className="text-xs text-[#4a3b2a] underline mt-2">查看整月</button>}
            </div>
          ) : (
            filteredTransactions.map((t) => (
              <TransactionItem
                key={t.id}
                data={t}
                categories={categories}
                onClick={() => onEdit(t)}
              // 移除列表中的删除按钮，只保留在编辑弹窗中
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- 统计 (未修改) ---
function StatsView({ transactions, categories }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [timeScale, setTimeScale] = useState('week');
  const [statType, setStatType] = useState('expense');
  const [showAnnualDetail, setShowAnnualDetail] = useState(false);
  const now = new Date();

  const yearlySummary = useMemo(() => {
    const yearTx = transactions.filter(t => new Date(t.date).getFullYear() === currentYear);
    const expense = yearTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const income = yearTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthTx = yearTx.filter(t => new Date(t.date).getMonth() === i);
      return {
        month: i + 1,
        expense: monthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
        income: monthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      };
    });
    return { expense, income, monthlyData, yearTx };
  }, [transactions, currentYear]);

  const chartData = useMemo(() => {
    const data = [];
    const filteredTx = transactions.filter(t => t.type === statType);
    const now = new Date();
    // Ensure data respects currentYear if scale is year/month, or logic needs to be consistent
    // For simplicity in this view:
    if (timeScale === 'year') {
      for (let i = 0; i < 12; i++) {
        const label = `${i + 1}月`;
        const val = filteredTx.filter(t => {
          const d = new Date(t.date);
          return d.getFullYear() === currentYear && d.getMonth() === i;
        }).reduce((sum, t) => sum + t.amount, 0);
        data.push({ label, value: val });
      }
    } else {
      // Fallback to relative time for day/week/month relative to today, 
      // or implement year-based logic. 
      // Keeping original relative logic for day/week/month as per request to just add year selection for annual bill/trend
      // But let's make 'month' scale respect selected year?
      if (timeScale === 'month') {
        // Show days of the current month in selected year? 
        // Or just default to "This Month" relative to now. 
        // Given the prompt "Statistics... should add year selection", let's make 'year' scale use it.
        // Reusing original logic for day/week/month relative to "now"
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i += 3) {
          const dateStr = new Date(now.getFullYear(), now.getMonth(), i).toLocaleDateString();
          const label = `${i}日`;
          const val = filteredTx.filter(t => new Date(t.date).toLocaleDateString() === dateStr).reduce((sum, t) => sum + t.amount, 0);
          data.push({ label, value: val });
        }
      } else if (timeScale === 'week') {
        const dayOfWeek = now.getDay() || 7;
        const monday = new Date(now); monday.setDate(now.getDate() - dayOfWeek + 1);
        for (let i = 0; i < 7; i++) {
          const d = new Date(monday); d.setDate(monday.getDate() + i);
          const label = ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
          const val = filteredTx.filter(t => new Date(t.date).toLocaleDateString() === d.toLocaleDateString()).reduce((sum, t) => sum + t.amount, 0);
          data.push({ label, value: val });
        }
      } else if (timeScale === 'day') {
        for (let i = 0; i <= 21; i += 3) {
          const label = `${i}点`;
          const val = filteredTx.filter(t => {
            const d = new Date(t.date);
            return d.toDateString() === now.toDateString() && d.getHours() >= i && d.getHours() < i + 3;
          }).reduce((sum, t) => sum + t.amount, 0);
          data.push({ label, value: val });
        }
      }
    }
    return data;
  }, [transactions, timeScale, statType, currentYear]);

  const groupedData = useMemo(() => {
    const data = {};
    // Filter by year for accuracy
    transactions.forEach(t => {
      const d = new Date(t.date);
      if (d.getFullYear() === currentYear && t.type === statType) {
        data[t.category] = (data[t.category] || 0) + Number(t.amount);
      }
    });
    return Object.entries(data).map(([name, value]) => {
      const catConfig = categories[statType].find(c => c.name === name) || {};
      return { name, value, icon: catConfig.icon || '📦', color: catConfig.color || '#d4d4d4' };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, statType, categories, currentYear]);

  const total = groupedData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8 animate-fade-in pt-4">
      {/* Year Selector */}
      <div className="flex items-center justify-center gap-4 bg-white p-2 rounded-xl border-2 border-[#5e4b35] shadow-sm">
        <button onClick={() => setCurrentYear(y => y - 1)} className="p-1 hover:bg-[#eee] rounded"><ChevronLeft size={20} className={THEME.text} /></button>
        <span className="text-lg font-black font-mono text-[#4a3b2a]">{currentYear}年</span>
        <button onClick={() => setCurrentYear(y => y + 1)} disabled={currentYear >= new Date().getFullYear()} className="p-1 hover:bg-[#eee] rounded disabled:opacity-30"><ChevronRight size={20} className={THEME.text} /></button>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-black ${THEME.text} pl-2 border-l-4 border-[#5e4b35]`}>趋势分析</h2>
          <div className={`flex bg-[#e6dccb] p-1 rounded-xl ${THEME.border} border-2`}>
            <button onClick={() => setStatType('expense')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${statType === 'expense' ? 'bg-[#ffadad] text-[#5e4b35] shadow-sm' : 'text-[#8d7b68]'}`}>支出</button>
            <button onClick={() => setStatType('income')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${statType === 'income' ? 'bg-[#caffbf] text-[#5e4b35] shadow-sm' : 'text-[#8d7b68]'}`}>收入</button>
          </div>
        </div>
        <div className="flex justify-between bg-white p-2 rounded-xl border-2 border-[#e6dccb] mb-4">
          {['day', 'week', 'month', 'year'].map((scale) => {
            const labels = { day: '今日', week: '本周', month: '本月', year: '全年' };
            return <button key={scale} onClick={() => setTimeScale(scale)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${timeScale === scale ? 'bg-[#5e4b35] text-white shadow-md' : 'text-[#8d7b68]'}`}>{labels[scale]}</button>
          })}
        </div>
        <div className="relative">
          <LineChart data={chartData} color={statType === 'expense' ? '#ffadad' : '#9bf6ff'} />
          <div className="absolute top-4 right-4 text-xs font-bold bg-[#fff9f0] px-3 py-1.5 rounded-lg border border-[#e6dccb] text-[#8d7b68]">合计: {formatMoney(total)}</div>
        </div>
      </section>

      <section
        onClick={() => setShowAnnualDetail(true)}
        className={`bg-white p-5 rounded-2xl ${THEME.border} ${THEME.shadow} relative overflow-hidden cursor-pointer hover:translate-y-[-2px] transition-transform`}
      >
        <div className="absolute top-4 right-4 text-[#d4c5b5]"><ChevronRight size={24} /></div>
        <h3 className={`text-lg font-black ${THEME.text} mb-4 flex items-center gap-2`}>
          <CalendarRange size={24} className="text-[#9bf6ff]" /> {currentYear} 年度账单
        </h3>
        <div className="flex gap-4">
          <div className="flex-1 p-3 bg-[#fff9f0] rounded-xl border-2 border-[#5e4b35]/10">
            <div className="text-xs font-bold text-[#8d7b68] mb-1">总收入</div>
            <div className="text-lg font-black text-[#48BB78]">{formatMoney(yearlySummary.income)}</div>
          </div>
          <div className="flex-1 p-3 bg-[#fff9f0] rounded-xl border-2 border-[#5e4b35]/10">
            <div className="text-xs font-bold text-[#8d7b68] mb-1">总支出</div>
            <div className="text-lg font-black text-[#4a3b2a]">{formatMoney(yearlySummary.expense)}</div>
          </div>
        </div>
        <div className="mt-3 text-xs font-bold text-[#8d7b68] text-right flex justify-end items-center gap-1">
          查看详情 <Receipt size={12} />
        </div>
      </section>

      {showAnnualDetail && (
        <AnnualBillModal
          onClose={() => setShowAnnualDetail(false)}
          summary={yearlySummary}
          topCategories={groupedData.slice(0, 3)}
          year={currentYear}
        />
      )}
    </div>
  );
}

// --- 年度账单Modal ---
function AnnualBillModal({ onClose, summary, topCategories, year }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#4a3b2a]/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-[320px] bg-[#fffefc] shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto custom-scrollbar rounded-sm">
        <div className="absolute top-0 left-0 w-full h-3 bg-[radial-gradient(circle_at_8px_0,_transparent_8px,_#fffefc_8px)] bg-[length:16px_16px] rotate-180 transform -translate-y-2 z-10"></div>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-1 bg-gray-100 rounded-full hover:bg-gray-200">
          <X size={20} className="text-gray-600" />
        </button>
        <div className="p-6 pt-12 pb-12 font-mono text-[#333]">
          <div className="text-center border-b-2 border-dashed border-[#bbb] pb-6 mb-6">
            <div className="text-2xl font-black tracking-widest uppercase mb-1">年度收支统计</div>
            <div className="text-sm font-bold text-gray-500">{year} 账单凭证</div>
          </div>
          <div className="space-y-4 mb-8 text-sm">
            <div className="flex justify-between items-end">
              <span className="font-bold">总收入</span>
              <span className="text-lg font-black">{formatMoney(summary.income)}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="font-bold">总支出</span>
              <span className="text-lg font-black">{formatMoney(summary.expense)}</span>
            </div>
            <div className="border-t border-dashed border-[#ccc] my-2"></div>
            <div className="flex justify-between items-end">
              <span className="font-black text-base">年度结余</span>
              <span className={`text-xl font-black ${summary.income - summary.expense >= 0 ? "text-black" : "text-red-500"}`}>
                {formatMoney(summary.income - summary.expense)}
              </span>
            </div>
          </div>
          <div className="mb-8">
            <div className="text-center text-[10px] font-bold text-gray-400 mb-2">——— 月度收支概览 ———</div>
            <div className="space-y-1.5">
              {summary.monthlyData.map((m) => (
                <div key={m.month} className="flex items-center text-[10px] gap-2 h-3">
                  <span className="w-4 font-bold text-right text-gray-500">{m.month}</span>
                  <div className="flex-1 flex h-full gap-0.5 opacity-80">
                    {m.expense > 0 && <div style={{ width: `${Math.min((m.expense / summary.expense) * 800, 100)}%` }} className="h-full bg-black/60"></div>}
                    {m.income > 0 && <div style={{ width: `${Math.min((m.income / summary.income) * 800, 100)}%` }} className="h-full bg-black/20"></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-center text-[10px] font-bold text-gray-400 mb-2">——— 消费排行 Top 3 ———</div>
            <div className="space-y-2 text-xs">
              {topCategories.map((cat, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="font-bold">{i + 1}. {cat.name}</div>
                  <div className="font-mono">{formatMoney(cat.value)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <div className="h-10 w-full bg-[repeating-linear-gradient(90deg,#333,#333_1px,transparent_1px,transparent_3px)] mb-2"></div>
            <div className="text-[10px] font-bold tracking-[0.3em] text-gray-400">谢谢惠顾</div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-3 bg-[radial-gradient(circle_at_8px_8px,_transparent_8px,_#fffefc_8px)] bg-[length:16px_16px] transform translate-y-2 z-10"></div>
      </div>
    </div>
  );
}

function TransactionItem({ data, categories, onClick, onDelete }) {
  const isExpense = data.type === 'expense';
  const catList = categories[data.type] || [];
  const catConfig = catList.find(c => c.name === data.category) || {};
  const bgColor = catConfig.color || '#fff';
  const icon = catConfig.icon || (isExpense ? '💸' : '💰');

  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 ${THEME.border} ${THEME.shadow} rounded-2xl hover:translate-y-[-2px] ${THEME.shadowHover} transition-all cursor-pointer relative overflow-hidden group`}
    >
      {/* Removed direct delete button from here */}

      {data.image && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#e6dccb]/60 rotate-2 backdrop-blur-sm border-x border-white/50 z-10"></div>
      )}
      <div className="flex items-start justify-between mb-2 relative z-0">
        <div className="flex items-start gap-4 w-full">
          <div className={`w-12 h-12 border-2 border-[#5e4b35] rounded-xl flex-shrink-0 flex items-center justify-center text-2xl shadow-sm bg-white`} style={{ backgroundColor: bgColor }}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <div className={`font-bold ${THEME.text} text-base`}>{data.category}</div>
              <div className={`text-lg font-black ${isExpense ? THEME.text : 'text-[#48BB78]'}`}>
                {isExpense ? '-' : '+'}{formatMoney(data.amount)}
              </div>
            </div>
            <div className={`text-xs font-bold ${THEME.textLight} mt-1 font-mono flex items-center gap-2`}>
              {new Date(data.date).toLocaleDateString()} {new Date(data.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className={`text-base ${THEME.text} mt-2 break-words leading-relaxed`}>{data.note}</div>
            {data.image && (
              <div className="mt-4 mb-2 relative inline-block group">
                <div className="bg-white p-2 pb-6 border-2 border-[#5e4b35] shadow-sm rotate-1 group-hover:rotate-0 transition-transform duration-300">
                  <img src={data.image} alt="record" className="w-full max-w-[200px] h-auto object-cover border border-[#eee]" />
                </div>
                <div className="absolute -top-3 right-1/2 translate-x-1/2 w-3 h-6 bg-[#5e4b35] rounded-full border-2 border-white"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      {data.emotionNote && (
        <div className="mt-2 text-xs font-bold text-[#8d7b68] bg-[#fdf6e3] p-3 rounded-lg border border-[#5e4b35]/20 border-dashed relative mx-1">
          <span className="absolute -left-1.5 -top-1.5 bg-white border border-[#5e4b35]/30 w-2 h-2 rounded-full"></span>
          <span className="absolute -right-1.5 -bottom-1.5 bg-white border border-[#5e4b35]/30 w-2 h-2 rounded-full"></span>
          {data.emotionNote}
        </div>
      )}
    </div>
  );
}

// --- 记账/编辑 Modal (双模式: 手动/语音) ---
function AddTransactionModal({ onClose, onSave, onDelete, categories, onAddCategory, initialData }) {
  // 模式: manual / voice
  const [inputMode, setInputMode] = useState(initialData ? 'manual' : 'manual');

  // 共享状态
  const [amount, setAmount] = useState(initialData ? String(initialData.amount) : '');
  const [note, setNote] = useState(initialData ? initialData.note : '');
  const [type, setType] = useState(initialData ? initialData.type : 'expense');
  const [date, setDate] = useState(initialData ? initialData.date : new Date().toISOString());
  const [categoryObj, setCategoryObj] = useState(categories.expense[0]);
  const [image, setImage] = useState(initialData ? initialData.image : null);
  const fileInputRef = useRef(null);

  // Manual: Calculator
  const [showCalculator, setShowCalculator] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('');
  const [newCatColor, setNewCatColor] = useState(COLOR_PALETTE[0]);

  // Voice: State
  const [isListening, setIsListening] = useState(false);
  const [voiceResult, setVoiceResult] = useState(null); // { amount, type, category, date, note }

  const [isPrinting, setIsPrinting] = useState(false);
  const [printedData, setPrintedData] = useState(null);

  // Init category
  useEffect(() => {
    if (initialData) {
      const foundCat = categories[initialData.type].find(c => c.name === initialData.category);
      if (foundCat) setCategoryObj(foundCat);
    } else if (categories[type] && categories[type].length > 0) {
      // Don't auto reset if already set by voice
    }
  }, [categories, initialData]);

  // --- Voice Logic (Enhanced) ---
  const processVoiceInput = (text) => {
    // 1. Amount (Use new parser)
    const extractedAmount = parseAmountFromVoice(text); // Ensure this returns Number or empty string

    // 2. Date
    const parsedDate = parseDateFromVoice(text); // Use new Date parser

    // 3. Category & Type
    const allCats = [...categories.expense, ...categories.income];
    let bestCat = categoryObj;
    let bestType = type;
    for (const cat of allCats) {
      if (text.includes(cat.name) || (cat.keywords && cat.keywords.some(k => text.includes(k)))) {
        bestCat = cat;
        const isExp = categories.expense.find(c => c.id === cat.id);
        bestType = isExp ? 'expense' : 'income';
        break;
      }
    }

    // 4. Clean Note
    let cleanedNote = text;
    // Remove extracted amount to clean note
    if (extractedAmount) {
      // Remove standard digits
      cleanedNote = cleanedNote.replace(/(\d+(\.\d+)?)/, '');
      // Remove chinese numbers roughly
      cleanedNote = cleanedNote.replace(/[零一二两三四五六七八九十百千万]+/, '');
    }

    // Remove keywords
    ['昨天', '前天', '今天', '明天', '中午', '早上', '晚上', '上午', '下午', '元', '块', '钱', '毛'].forEach(t => {
      cleanedNote = cleanedNote.replace(new RegExp(t, 'g'), '');
    });
    if (bestCat) {
      cleanedNote = cleanedNote.replace(new RegExp(bestCat.name, 'g'), '');
      if (bestCat.keywords) bestCat.keywords.forEach(k => {
        cleanedNote = cleanedNote.replace(new RegExp(k, 'g'), '');
      });
    }
    cleanedNote = cleanedNote.replace(/(花费了|花了|用了|支出|收入|赚了)/g, '').trim();
    if (!cleanedNote) cleanedNote = bestCat.name;

    // Set Result
    setVoiceResult({
      amount: extractedAmount,
      type: bestType,
      category: bestCat,
      date: parsedDate.toISOString(),
      note: cleanedNote,
      rawText: text
    });
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("不支持语音识别"); return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN'; recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => { processVoiceInput(event.results[0][0].transcript); };
    recognition.start();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNewCategory = () => {
    if (!newCatName || !newCatIcon) return;
    const newCat = { id: Date.now().toString(), name: newCatName, icon: newCatIcon, color: newCatColor, keywords: [] };
    onAddCategory(type, newCat);
    setCategoryObj(newCat);
    setIsAddingCategory(false);
    setNewCatName(''); setNewCatIcon('');
  };

  const submitTransaction = (txData) => {
    const numAmount = parseFloat(txData.amount);
    if (isNaN(numAmount)) return;
    const emotionNote = getEmotionMessage(numAmount, txData.category.name, txData.type);

    const newTx = {
      id: initialData ? initialData.id : Date.now(),
      amount: numAmount,
      category: txData.category.name,
      type: txData.type,
      note: txData.note,
      date: txData.date,
      emotionNote,
      image: txData.image || image
    };
    setPrintedData(newTx);
    setIsPrinting(true);
  };

  const handleManualConfirm = () => {
    if (!amount) return;
    const finalAmount = safeCalculate(amount);
    submitTransaction({ amount: finalAmount, category: categoryObj, type: type, note: note || categoryObj.name, date: date, image: image });
  };

  const handleVoiceConfirm = () => {
    if (voiceResult && voiceResult.amount) {
      submitTransaction({
        amount: voiceResult.amount,
        category: voiceResult.category,
        type: voiceResult.type,
        note: voiceResult.note,
        date: voiceResult.date,
        image: null
      });
    }
  };

  const handlePrintComplete = () => {
    setTimeout(() => {
      onSave(printedData);
      onClose();
    }, 1200);
  };

  const handleCalcInput = (key) => setAmount(prev => prev + key);
  const handleCalcDelete = () => setAmount(prev => prev.slice(0, -1));

  if (isPrinting && printedData) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#4a3b2a]/80 backdrop-blur-sm">
        <div className="relative w-80 bg-white shadow-2xl animate-receipt-slide-down rounded-sm overflow-hidden" style={{ filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))' }}>
          <div className="absolute top-0 left-0 w-full h-4 bg-[radial-gradient(circle_at_10px_0,_transparent_10px,_#fff_11px)] bg-[length:20px_20px] rotate-180 transform -translate-y-2"></div>
          <div className="p-8 pt-10 text-center font-mono text-[#5e4b35]">
            <div className="text-xl font-black mb-4 uppercase tracking-widest border-b-2 border-dashed border-[#5e4b35]/30 pb-4"><TypewriterText text="收据凭证" speed={100} /></div>
            <div className="text-left space-y-4 mb-6 text-sm">
              <div className="flex justify-between"><span>项目:</span><span className="font-bold"><TypewriterText text={printedData.category} speed={50} /></span></div>
              <div className="flex justify-between"><span>金额:</span><span className="text-xl bg-[#ffadad] px-1"><TypewriterText text={formatMoney(printedData.amount)} speed={50} onComplete={handlePrintComplete} /></span></div>
              <div className="flex justify-between text-xs text-gray-500 mt-2"><span>时间:</span><span><TypewriterText text={new Date(printedData.date).toLocaleDateString()} speed={30} /></span></div>
            </div>
            <div className="mt-8 text-xs font-black">谢谢惠顾!</div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-4 bg-[radial-gradient(circle_at_10px_10px,_transparent_10px,_#fff_11px)] bg-[length:20px_20px] transform translate-y-2"></div>
        </div>
      </div>
    );
  }

  if (isAddingCategory) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#4a3b2a]/80 backdrop-blur-sm animate-fade-in p-4">
        <div className={`bg-[#fff] w-full sm:w-[320px] border-4 border-[#5e4b35] shadow-[6px_6px_0_0_#c2a58d] rounded-2xl p-5 relative`}>
          <h3 className="text-lg font-black text-[#4a3b2a] mb-4 text-center border-b-2 border-[#ffadad] inline-block pb-1">新建分类</h3>
          <div className="space-y-3">
            <div><label className="text-xs font-bold text-[#8d7b68] mb-1 block">图标 (Emoji)</label><input type="text" placeholder="✨" className="w-full text-center text-3xl border-2 border-[#5e4b35] rounded-xl p-2 outline-none focus:bg-[#fff9f0]" value={newCatIcon} onChange={(e) => setNewCatIcon(e.target.value)} maxLength={2} /></div>
            <div><label className="text-xs font-bold text-[#8d7b68] mb-1 block">名称</label><input type="text" placeholder="例如：看展" className="w-full border-2 border-[#5e4b35] rounded-xl p-2 font-bold text-[#4a3b2a] outline-none" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} /></div>
            <div><label className="text-xs font-bold text-[#8d7b68] mb-2 block">颜色</label><div className="flex flex-wrap gap-2">{COLOR_PALETTE.map(c => (<button key={c} onClick={() => setNewCatColor(c)} className={`w-6 h-6 rounded-full border border-[#5e4b35] transition-transform ${newCatColor === c ? 'scale-125 shadow-sm' : 'hover:scale-110'}`} style={{ backgroundColor: c }} />))}</div></div>
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={() => setIsAddingCategory(false)} className="flex-1 py-2 font-bold text-[#8d7b68] hover:bg-[#eee] rounded-xl text-sm">取消</button>
            <button onClick={handleSaveNewCategory} disabled={!newCatName || !newCatIcon} className="flex-1 py-2 bg-[#5e4b35] text-white font-bold rounded-xl shadow-md active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 text-sm">保存</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#4a3b2a]/60 backdrop-blur-sm animate-fade-in p-4">
      <div className={`bg-[#fff] w-full sm:w-[400px] border-4 border-[#5e4b35] shadow-[10px_10px_0_0_#432818] rounded-3xl p-0 relative transform transition-transform duration-300 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar`}>
        <div className="bg-[#fff0db] h-12 rounded-t-xl border-b-4 border-[#5e4b35] flex items-center justify-between px-4 sticky top-0 z-10">
          <div className="flex bg-[#e6dccb] p-1 rounded-lg border-2 border-[#5e4b35] gap-1">
            <button onClick={() => setInputMode('manual')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${inputMode === 'manual' ? 'bg-[#5e4b35] text-white' : 'text-[#8d7b68]'}`}>手动输入</button>
            <button onClick={() => setInputMode('voice')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${inputMode === 'voice' ? 'bg-[#5e4b35] text-white' : 'text-[#8d7b68]'}`}>语音智能</button>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#eee8d5] rounded"><X size={20} className={THEME.text} strokeWidth={3} /></button>
        </div>

        <div className="p-6 relative">
          {inputMode === 'manual' && (
            <>
              <div className={`flex bg-[#fff9f0] p-1.5 mb-4 rounded-xl border-2 border-[#5e4b35]/20`}>
                <button className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'expense' ? `bg-[#ffadad] text-[#5e4b35] border-2 border-[#5e4b35] shadow-sm` : `text-[#8d7b68]`}`} onClick={() => setType('expense')}>支出</button>
                <button className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'income' ? `bg-[#caffbf] text-[#5e4b35] border-2 border-[#5e4b35] shadow-sm` : `text-[#8d7b68]`}`} onClick={() => setType('income')}>收入</button>
              </div>
              <div className="mb-4 flex items-center gap-2 border-b-4 border-[#5e4b35] bg-[#fffaf5] p-2 hover:bg-[#fff]">
                <Clock size={16} className="text-[#8d7b68]" />
                <input type="datetime-local" value={formatDateForInput(date)} onChange={(e) => setDate(new Date(e.target.value).toISOString())} className="bg-transparent w-full text-sm font-bold text-[#4a3b2a] outline-none" />
              </div>
              <div className="mb-4 relative">
                <label className={`text-xs font-bold ${THEME.textLight} mb-1 block`}>金额</label>
                <div className={`flex items-center border-b-4 border-[#5e4b35] bg-[#fffaf5] p-3 hover:bg-[#fff] cursor-pointer ${showCalculator ? 'bg-[#fff]' : ''}`} onClick={() => setShowCalculator(true)}>
                  <span className={`text-2xl font-black mr-2 ${THEME.text}`}>¥</span>
                  <div className={`w-full bg-transparent text-3xl font-mono font-bold outline-none ${THEME.text} min-h-[40px] flex items-center`}>{amount || "0.00"}{!amount && <span className="text-[#d4c5b5]"></span>}</div>
                  <Keyboard className="text-[#8d7b68] ml-auto" />
                </div>
              </div>
              {showCalculator && (<div className="mb-6 animate-fade-in"><CalculatorKeypad onKeyPress={handleCalcInput} onDelete={handleCalcDelete} onConfirm={() => setShowCalculator(false)} /></div>)}
              {!showCalculator && (
                <>
                  <div className="mb-4">
                    <label className={`text-xs font-bold ${THEME.textLight} mb-2 block flex justify-between`}><span>附件图片</span>{image && <button onClick={() => setImage(null)} className="text-red-400 flex items-center gap-1"><Trash2 size={12} /> 移除</button>}</label>
                    {!image ? (<button onClick={() => fileInputRef.current.click()} className="w-full h-12 border-2 border-dashed border-[#5e4b35]/30 bg-[#fffaf5] rounded-xl flex items-center justify-center gap-2 text-[#8d7b68] hover:bg-[#fff0db] transition-colors"><Camera size={16} /><span className="text-xs font-bold">添加图片</span></button>) : (<div className="w-full h-24 bg-[#fffaf5] rounded-xl border-2 border-[#5e4b35] relative overflow-hidden group"><img src={image} alt="preview" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => fileInputRef.current.click()} className="bg-white p-2 rounded-full shadow-lg"><Camera size={16} /></button></div></div>)}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </div>
                  <div className="mb-4">
                    <label className={`text-xs font-bold ${THEME.textLight} mb-2 block`}>选择分类</label>
                    <div className="grid grid-cols-4 gap-3 max-h-[120px] overflow-y-auto custom-scrollbar p-1">
                      {categories[type].map(c => (
                        <button key={c.id} onClick={() => setCategoryObj(c)} className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${categoryObj.id === c.id ? `bg-[${c.color}] border-[#5e4b35] shadow-[2px_2px_0_0_#c2a58d] translate-y-[-2px]` : 'bg-white border-transparent hover:border-[#5e4b35]/20'}`} style={categoryObj.id === c.id ? { backgroundColor: c.color } : {}}>
                          <span className="text-lg mb-1 filter drop-shadow-sm">{c.icon}</span>
                          <span className={`text-[10px] font-bold ${THEME.text} scale-90`}>{c.name}</span>
                        </button>
                      ))}
                      <button onClick={() => setIsAddingCategory(true)} className="flex flex-col items-center justify-center p-2 rounded-xl border-2 border-dashed border-[#5e4b35]/30 hover:bg-[#fff] hover:border-[#5e4b35] transition-all group">
                        <Plus size={20} className="text-[#5e4b35]/50 group-hover:text-[#5e4b35]" />
                        <span className="text-[10px] font-bold text-[#5e4b35]/50 mt-1">新建</span>
                      </button>
                    </div>
                  </div>
                  <div className="mb-6 flex gap-3">
                    <div className={`flex-1 border-b-4 border-[#5e4b35] bg-[#fffaf5] px-3 py-2 flex items-center hover:bg-[#fff] transition-colors`}>
                      <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="备注..." className={`bg-transparent w-full outline-none text-sm font-bold ${THEME.text} placeholder-[#d4c5b5]`} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    {initialData && (<button onClick={() => onDelete(initialData.id)} className="w-14 bg-red-100 text-red-500 font-bold py-3 rounded-xl border-2 border-red-500 hover:bg-red-200 flex items-center justify-center"><Trash2 size={20} /></button>)}
                    <button onClick={handleManualConfirm} disabled={!amount} className={`flex-1 bg-[#5e4b35] text-[#fff] font-bold text-lg py-3 rounded-xl ${THEME.border} ${THEME.shadow} active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group hover:bg-[#4a3b2a]`}>
                      <Check size={20} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                      <span className="tracking-widest">{initialData ? '保存修改' : '确认记账'}</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {inputMode === 'voice' && (
            <div className="flex flex-col items-center justify-center py-4 animate-fade-in">
              <button onClick={startListening} className={`w-20 h-20 rounded-full border-4 border-[#5e4b35] flex items-center justify-center mb-6 shadow-[6px_6px_0_0_#c2a58d] active:shadow-none active:translate-y-1 transition-all ${isListening ? 'bg-red-400 animate-pulse' : 'bg-white hover:bg-[#fff0db]'}`}><Mic size={36} className={THEME.text} /></button>
              <div className="text-center space-y-2 mb-6">
                <p className="text-sm font-bold text-[#4a3b2a]">{isListening ? '正在聆听...' : '点击麦克风，说出消费'}</p>
                {!voiceResult && <p className="text-xs text-[#8d7b68]">例: "昨天中午吃饭花了20元"</p>}
              </div>

              {voiceResult && (
                <div className="w-full bg-[#fff] border-2 border-[#5e4b35] p-4 rounded-xl shadow-md mb-6 animate-slide-up relative overflow-hidden">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#ffadad] rounded-full opacity-20"></div>
                  <div className="text-xs font-bold text-[#8d7b68] mb-3 border-b border-dashed border-[#ccc] pb-2 flex justify-between"><span>识别结果 (可点击修改)</span><span className="text-[10px] bg-[#eee] px-1 rounded">AI PREVIEW</span></div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm items-center">
                    <div className="text-[#8d7b68] text-right font-bold">金额:</div>
                    <div className="flex items-center border-b border-[#eee]"><span className="text-xs mr-1">¥</span><input type="number" value={voiceResult.amount} onChange={(e) => setVoiceResult({ ...voiceResult, amount: e.target.value })} className="font-black text-2xl text-[#4a3b2a] w-full outline-none bg-transparent" /></div>

                    <div className="text-[#8d7b68] text-right font-bold">分类:</div>
                    <div className="flex items-center gap-2"><span className="text-lg">{voiceResult.category?.icon}</span><span className="font-bold">{voiceResult.category?.name}</span><span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${voiceResult.type === 'expense' ? 'bg-[#ffadad]' : 'bg-[#caffbf]'}`}>{voiceResult.type === 'expense' ? '支出' : '收入'}</span></div>

                    <div className="text-[#8d7b68] text-right font-bold">时间:</div>
                    <div className="font-bold font-mono">{new Date(voiceResult.date).toLocaleString()}</div>

                    <div className="text-[#8d7b68] text-right font-bold self-start mt-1">备注:</div>
                    <input value={voiceResult.note} onChange={(e) => setVoiceResult({ ...voiceResult, note: e.target.value })} className="bg-[#fff9f0] p-2 rounded border border-[#eee] text-xs font-bold text-[#4a3b2a] w-full outline-none" />
                  </div>
                </div>
              )}

              {voiceResult && (
                <div className="flex gap-3 w-full">
                  <button onClick={() => setVoiceResult(null)} className="w-14 bg-white border-2 border-[#5e4b35] rounded-xl flex items-center justify-center text-[#8d7b68]"><RefreshCw size={18} /></button>
                  <button onClick={handleVoiceConfirm} disabled={!voiceResult.amount} className={`flex-1 bg-[#5e4b35] text-[#fff] font-bold text-lg py-3 rounded-xl ${THEME.border} ${THEME.shadow} active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group hover:bg-[#4a3b2a]`}><Check size={20} strokeWidth={3} className="group-hover:scale-110 transition-transform" /><span className="tracking-widest">确认记账</span></button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavIcon({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all duration-200 ${active ? 'transform -translate-y-1' : 'hover:opacity-70'}`}>
      <div className={`p-1.5 rounded-lg ${active ? 'bg-[#5e4b35] text-[#fff]' : 'text-[#8d7b68]'}`}><Icon size={18} strokeWidth={active ? 3 : 2} /></div>
      <span className={`text-[10px] font-bold ${active ? THEME.text : THEME.textLight}`}>{label}</span>
    </button>
  );
}