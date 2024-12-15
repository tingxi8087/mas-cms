import { message } from "antd";

const dataSource = [
  {
    id: 1,
    name: "小蔡",
    age: 2.5,
    des: "一个学生",
    like: "唱、跳rap、篮球",
  },
  {
    id: 2,
    name: "小红",
    age: 19,
    des: "一个快乐的孩子",
    like: "画画、看书、游泳",
  },
  {
    id: 3,
    name: "小华",
    age: 18,
    des: "一个好奇的孩子",
    like: "玩具、看动画片、玩滑梯",
  },
  {
    id: 4,
    name: "小李",
    age: 12,
    des: "一个活泼的孩子",
    like: "跑步、跳绳、玩沙子",
  },
  {
    id: 5,
    name: "小吴",
    age: 9,
    des: "一个善良的孩子",
    like: "帮助他人、分享、植物",
  },
  {
    id: 6,
    name: "小王",
    age: 18,
    des: "一个勤奋的学生",
    like: "学习、阅读、编程",
  },
  {
    id: 7,
    name: "小刘",
    age: 11,
    des: "一个勇敢的孩子",
    like: "爬山、骑自行车、探索",
  },
  {
    id: 8,
    name: "小杨",
    age: 20,
    des: "一个有想象力的孩子",
    like: "讲故事、发明、画漫画",
  },
  {
    id: 9,
    name: "小陈",
    age: 13,
    des: "一个喜欢动物的孩子",
    like: "看动物、饲养宠物、看动物纪录片",
  },
  {
    id: 10,
    name: "小林",
    age: 14,
    des: "一个喜欢科学的学生",
    like: "实验、探索、研究",
  },
  {
    id: 11,
    name: "小张",
    age: 17,
    des: "一个喜欢音乐的孩子",
    like: "听音乐、弹钢琴、唱歌",
  },
  {
    id: 12,
    name: "小周",
    age: 15,
    des: "一个热爱运动的学生",
    like: "打篮球、踢足球、游泳",
  },
  {
    id: 13,
    name: "小邹",
    age: 9,
    des: "一个喜欢烹饪的孩子",
    like: "烘焙、制作美食、尝试新菜品",
  },
  {
    id: 14,
    name: "小马",
    age: 16,
    des: "一个热爱自然的孩子",
    like: "徒步、观察植物、露营",
  },
  {
    id: 15,
    name: "小胡",
    age: 10,
    des: "一个有责任感的学生",
    like: "义工服务、照顾弟妹、照顾宠物",
  },
  {
    id: 16,
    name: "小曾",
    age: 20,
    des: "一个喜欢数学的学生",
    like: "解决问题、数学竞赛、逻辑游戏",
  },
  {
    id: 17,
    name: "小钟",
    age: 9,
    des: "一个喜欢历史的学生",
    like: "阅读历史书籍、参观博物馆、研究历史事件",
  },
  {
    id: 18,
    name: "小吕",
    age: 15,
    des: "一个热爱电子游戏的学生",
    like: "电子竞技、策略游戏、虚拟现实游戏",
  },
  {
    id: 19,
    name: "小程",
    age: 9,
    des: "一个喜欢摄影的学生",
    like: "拍照、修图、户外摄影",
  },
  {
    id: 20,
    name: "小陆",
    age: 18,
    des: "一个热爱旅行的学生",
    like: "旅游、探索新地方、学习新文化",
  },
  {
    id: 21,
    name: "小罗",
    age: 11,
    des: "一个喜欢设计的学生",
    like: "绘画、创新、图形设计",
  },
  {
    id: 22,
    name: "小谭",
    age: 14,
    des: "一个热爱运动的学生",
    like: "篮球、足球、健身",
  },
  {
    id: 23,
    name: "小于",
    age: 9,
    des: "一个喜欢舞蹈的学生",
    like: "街舞、芭蕾、现代舞",
  },
  {
    id: 24,
    name: "小孟",
    age: 16,
    des: "一个喜欢编程的学生",
    like: "Python、Web开发、AI",
  },
  {
    id: 25,
    name: "小金",
    age: 13,
    des: "一个喜欢阅读的学生",
    like: "科幻小说、历史书籍、诗歌",
  },
  {
    id: 26,
    name: "小易",
    age: 12,
    des: "一个喜欢电影的学生",
    like: "剧情片、科幻片、纪录片",
  },
  {
    id: 27,
    name: "小聂",
    age: 10,
    des: "一个喜欢写作的学生",
    like: "小说、日记、散文",
  },
  {
    id: 28,
    name: "小夏",
    age: 8,
    des: "一个热爱音乐的学生",
    like: "吉他、钢琴、作曲",
  },
  {
    id: 29,
    name: "小秦",
    age: 20,
    des: "一个喜欢艺术的学生",
    like: "绘画、雕塑、设计",
  },
];

export const getStudentHttp = (
  req:
    | {
        pageNum?: number;
        pageSize?: number;
        id?: number;
        name?: string;
        age?: number;
        des?: string;
        like?: string;
      }
    | any
) =>
  new Promise<{
    data: { list: any[]; total: number; pageNum: number; pageSize: number };
    status: 0 | 1;
  }>((resolve) => {
    // Destructure the request parameters
    const {
      pageNum: tempPageNum,
      pageSize: tempPageSize,
      id,
      name,
      age,
      des,
      like,
    } = req;
    const pageNum = tempPageNum || 1;
    const pageSize = tempPageSize || 5;
    // Filter the dataSource based on the provided parameters
    let filteredData = dataSource;

    if (id) {
      filteredData = filteredData.filter((student) => student.id === id);
    }

    if (name) {
      filteredData = filteredData.filter((student) =>
        student.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (age) {
      filteredData = filteredData.filter((student) => student.age === age);
    }

    if (des) {
      filteredData = filteredData.filter((student) =>
        student.des.toLowerCase().includes(des.toLowerCase())
      );
    }

    if (like) {
      filteredData = filteredData.filter((student) =>
        student.like.toLowerCase().includes(like.toLowerCase())
      );
    }
    // Calculate the start and end index based on pagination parameters
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    // Slice the filtered data based on the pagination range
    const paginatedData = filteredData.slice(startIndex, endIndex);
    // Simulate a delay to mimic an asynchronous HTTP request
    setTimeout(() => {
      resolve({
        status: 1,
        data: {
          list: paginatedData,
          total: dataSource.length,
          pageNum,
          pageSize,
        },
      });
    }, 500);
  });
export const setStudentHttp = (req: {
  id: number;
  name?: string;
  age?: number;
  des?: string;
  like?: string;
}) =>
  new Promise<{ status: 0 | 1; data: string | 1 }>((resolve) => {
    const { id, name, age, des, like } = req;

    // 在 dataSource 中查找要更新的学生
    const studentIndex = dataSource.findIndex((student) => student.id === id);

    // 如果找到了匹配的学生
    if (studentIndex !== -1) {
      const updatedStudent = {
        ...dataSource[studentIndex],
        name: name || dataSource[studentIndex].name,
        age: age || dataSource[studentIndex].age,
        des: des || dataSource[studentIndex].des,
        like: like || dataSource[studentIndex].like,
      };

      // 更新学生信息
      dataSource[studentIndex] = updatedStudent;

      // 模拟异步请求，延迟 500 毫秒后返回更新后的学生信息
      setTimeout(() => {
        resolve({
          data: 1,
          status: 1,
        });
      }, 500);
    } else {
      message.error("更新学生失败！");
      resolve({
        data: "更新学生失败！",
        status: 0,
      });
    }
  });
export const addStudentHttp = (req: {
  name: string;
  age: number;
  des: string;
  like?: string;
}) =>
  new Promise<{ status: 0 | 1; data: string | 1 }>((resolve) => {
    const { name, age, des, like } = req;

    // 生成随机的 id
    const id = Math.floor(Math.random() * 10000) + 1;

    // 创建新的学生对象
    const newStudent = {
      id,
      name,
      age,
      des,
      like: like || "",
    };

    // 将新学生添加到 dataSource 中
    dataSource.unshift(newStudent);

    // 模拟异步请求，延迟 500 毫秒后返回新添加的学生信息
    setTimeout(() => {
      resolve({
        data: "添加成功！",
        status: 1,
      });
    }, 500);
  });
export const delStudentHttp = (id: number) =>
  new Promise<{ status: 0 | 1; data: string | 1 }>((resolve) => {
    // 在 dataSource 中查找要删除的学生
    const studentIndex = dataSource.findIndex((student) => student.id === id);
    // 如果找到了匹配的学生
    if (studentIndex !== -1) {
      // 从 dataSource 中移除学生
      dataSource.splice(studentIndex, 1)[0];

      // 模拟异步请求，延迟 500 毫秒后返回被删除的学生信息
      setTimeout(() => {
        resolve({
          data: 1,
          status: 1,
        });
      }, 500);
    } else {
      // 如果未找到匹配的学生，则返回错误
      message.error("删除失败！");
      resolve({
        data: "删除失败！",
        status: 0,
      });
    }
  });
