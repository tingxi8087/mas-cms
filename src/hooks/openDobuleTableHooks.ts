import React, { useEffect, useRef, useState } from 'react';

/**
 * 带存储功能的useState hook
 * @param key 唯一标识符，用于localStorage存储
 * @param defaultValue 默认值
 * @returns [state, setState] 与useState相同的返回值
 */
function useStoredState<T>(key: string, defaultValue: T): [T, (value: T | ((prevState: T) => T)) => void] {
  // 从localStorage获取初始值
  const getStoredValue = (): T => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        const parsed = JSON.parse(storedValue);
        // 检查是否是新的存储格式 {value: ...}
        if (parsed && typeof parsed === 'object' && 'value' in parsed) {
          return parsed.value === null || parsed.value === undefined ? defaultValue : parsed.value;
        }
        // 兼容旧的存储格式（直接存储值）
        return defaultValue;
      }
    } catch (error) {
      console.warn(`Failed to parse stored value for key "${key}":`, error);
    }
    return defaultValue;
  };

  // 初始化状态
  const [state, setState] = useState<T>(getStoredValue);

  // 存储值到localStorage
  const setStoredValue = (value: T) => {
    try {
      // 存储为 {value: ...} 格式，避免基本类型与对象类型混淆
      localStorage.setItem(key, JSON.stringify({ value }));
    } catch (error) {
      console.warn(`Failed to store value for key "${key}":`, error);
    }
  };

  // 包装setState，每次状态变更时都存储到localStorage
  const setStoredState = (value: T | ((prevState: T) => T)) => {
    setState((prevState) => {
      const newState = typeof value === 'function' ? (value as (prevState: T) => T)(prevState) : value;
      setStoredValue(newState);
      return newState;
    });
  };
  useEffect(() => {
    getStoredValue();
    setStoredState(getStoredValue());
  }, [key]);

  return [state, setStoredState];
}
/**
 * 生成请求标识
 */
const getUUId = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

/**
 * 表格数据请求返回结构
 */
type GetTableDataResult<TData> = {
  data: TData[];
  total: number;
  pageNum?: number;
  pageSize?: number;
  render?: boolean;
};
/**
 * 获取表格数据的异步函数
 */
export type GetTableDataFn<TData> = () => Promise<GetTableDataResult<TData>>;
/**
 * 根据 id 列表更新数据的异步函数
 */
export type UpdateGetTableDataByIdFn = (idArr: string[]) => Promise<any[]>;
/**
 * useBasePageTable 的配置
 */
type UseBasePageTableOptions<TData, TSearchParams> = {
  defaultPageSize?: number;
  cachePageSizeKey?: string;
  getTableData: ({
    pageNum,
    pageSize,
    searchParams
  }: {
    pageNum: number;
    pageSize: number;
    searchParams: TSearchParams;
  }) => Promise<GetTableDataResult<TData>>;
  debounceTime?: number;
};

/**
 * useBasePageTable 的返回结构
 */
export type UseBasePageTableReturn<TData, TSearchParams> = {
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  pageNum: number;
  setPageNum: React.Dispatch<React.SetStateAction<number>>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  searchParams: TSearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<TSearchParams>>;
  tableData: TData[];
  setTableData: React.Dispatch<React.SetStateAction<TData[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  reloadTable: () => void;
};

/**
 * 基础分页表格 hook
 */
export const useBasePageTable = <TData = any, TSearchParams = any>(
  options: UseBasePageTableOptions<TData, TSearchParams>
): UseBasePageTableReturn<TData, TSearchParams> => {
  const [defaultPageSize, setDefaultPageSize] = useStoredState(
    options.cachePageSizeKey || '_useBasePageTable_defaultPageSize',
    options.defaultPageSize || 20
  );
  const { getTableData, debounceTime = 200 } = options;
  const [pageSize, setPageSize] = useState(options.cachePageSizeKey ? defaultPageSize : options.defaultPageSize || 20);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<TSearchParams>({} as TSearchParams);
  const [tableData, setTableData] = useState<TData[]>([]);
  const [reloadState, setReloadState] = useState(false);
  const debounceTimer = useRef<any>(null);
  const uuIdRef = useRef(getUUId());
  useEffect(() => {
    if (options.cachePageSizeKey) {
      setDefaultPageSize(pageSize);
    }
  }, [pageSize]);
  const getTableDataWrp = (reqId: string) => {
    setLoading(true);
    getTableData({ pageNum, pageSize, searchParams })
      .then(({ data, total, pageNum, pageSize, render = true }) => {
        if (!render) return;
        if (uuIdRef.current !== reqId) return;
        setTableData(data);
        setTotal(total);
        if (pageNum) {
          setPageNum(pageNum);
        }
        if (pageSize) {
          setPageSize(pageSize);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const reqId = getUUId();
      uuIdRef.current = reqId;
      getTableDataWrp(reqId);
    }, debounceTime);
  }, [pageNum, reloadState]);
  useEffect(() => {
    setPageNum(1);
    setReloadState((prev) => !prev);
  }, [searchParams, pageSize]);
  const reloadTable = () => {
    setReloadState((prev) => !prev);
  };
  return {
    pageSize,
    setPageSize,
    pageNum,
    setPageNum,
    total,
    setTotal,
    searchParams,
    setSearchParams,
    tableData,
    setTableData,
    loading,
    setLoading,
    reloadTable
  };
};

/**
 * 根据 id 列表刷新表格局部数据
 */
export const useReloadDataById = ({
  getTableDataById,
  setTableData,
  idName
}: {
  getTableDataById: UpdateGetTableDataByIdFn;
  setTableData: React.Dispatch<React.SetStateAction<any[]>>;
  idName: string;
}) => {
  const reloadDataById = (idArr: string[]) => {
    getTableDataById(idArr).then((data) => {
      setTableData((newData) => {
        data.forEach((item: any) => {
          const index = idArr.findIndex((id) => id === item[idName]);
          if (index !== -1) {
            newData[index] = { ...newData[index], ...item };
          }
        });
        return [...newData];
      });
    });
  };
  return reloadDataById;
};

/**
 * useTableChecked 的配置
 */
type UseTableCheckedOptions<TData> = {
  tableData: TData[];
  setTableData: React.Dispatch<React.SetStateAction<TData[]>>;
  idName: string;
};

/**
 * useTableChecked 的返回结构
 */
export type UseTableCheckedReturn<TData> = {
  // 根据 id 切换选中状态
  toggleChecked: (id?: string | number) => void;
  // 批量设置选中状态
  changeChecked: (ids: (string | number)[], checked: boolean) => void;
  // 全选/取消全选（根据当前选中态判断）
  handleSelectAll: () => void;
  // 已选中的 id 数组
  checkedIds: (string | number)[];
  // 已选中的项数组
  checkedItems: TData[];
  // 是否全选
  isAllChecked: boolean;
  // 已选中数量
  checkedCount: number;
  // 是否半选（部分选中）
  isIndeterminate: boolean;
};

/**
 * 管理表格多选状态的 hook
 */
export const useTableChecked = <TData extends Record<string, any> = any>({
  tableData = [],
  setTableData = () => undefined,
  idName
}: UseTableCheckedOptions<TData>): UseTableCheckedReturn<TData> => {
  // 根据 id 切换选中状态
  const toggleChecked = (id?: string | number) => {
    if (id === undefined || id === null) return;
    setTableData((prevData) =>
      prevData.map((item) => (item[idName] === id ? { ...item, _checked: !(item._checked ?? false) } : item))
    );
  };

  // 批量设置选中状态
  const changeChecked = (ids: (string | number)[], checked: boolean) => {
    setTableData((prevData) =>
      prevData.map((item) => (ids.includes(item[idName]) ? { ...item, _checked: checked } : item))
    );
  };

  // 全选/取消全选（根据当前选中态判断）
  const handleSelectAll = () => {
    setTableData((prevData) => {
      const allChecked = prevData.length > 0 && prevData.every((item) => (item._checked ?? false) === true);
      return prevData.map((item) => ({ ...item, _checked: !allChecked }));
    });
  };

  // 计算是否全选
  const isAllChecked = tableData.length > 0 && tableData.every((item) => (item._checked ?? false) === true);

  // 计算已选中数量
  const checkedCount = tableData.filter((item) => (item._checked ?? false) === true).length;

  // 已选中的 id 数组（实时聚合）
  const checkedIds = tableData.filter((item) => (item._checked ?? false) === true).map((item) => item[idName]);

  // 已选中的项数组（实时聚合）
  const checkedItems = tableData.filter((item) => (item._checked ?? false) === true);

  // 是否半选（部分选中：有选中的但不是全部选中）
  const isIndeterminate = checkedCount > 0 && !isAllChecked;

  return {
    toggleChecked,
    changeChecked,
    handleSelectAll,
    checkedIds,
    checkedItems,
    isAllChecked,
    checkedCount,
    isIndeterminate
  };
};

/**
 * useGetIndexById 的配置
 */
type UseGetIndexByIdOptions<TData> = {
  tableData: TData[];
  idName: string;
};

/**
 * 根据 id 获取索引的 hook
 */
export const useGetIndexById = <TData extends Record<string, any> = any>({
  tableData = [],
  idName
}: UseGetIndexByIdOptions<TData>) => {
  const tableDataRef = useRef(tableData);
  useEffect(() => {
    tableDataRef.current = tableData;
  }, [tableData]);
  const getIndexById = (id: string | number): number => {
    return tableDataRef?.current?.findIndex?.((item) => item[idName] === id);
  };
  return getIndexById;
};

/**
 * 通过 id 复制表格数据的 hook
 */
export const useCopyDataByIds = <TData extends Record<string, any> = any>(
  tableData: TData[],
  setTableData: React.Dispatch<React.SetStateAction<TData[]>>,
  idName: string
) => {
  const getIndexById = useGetIndexById<TData>({
    tableData: tableData,
    idName
  });
  const copyDataById = (ids: string[]) => {
    const newData: TData[] = [];
    try {
      ids.forEach((id, iIndex) => {
        const index = getIndexById(id);
        if (index !== -1) {
          const item = {
            ...JSON.parse(JSON.stringify(tableData[index])),
            [idName]: `${tableData?.[index]?.[idName]}-copy-${Date.now()}-${iIndex}`,
            _checked: false
          } as TData;
          newData.push(item);
        }
      });
    } catch (error) {
      console.error('复制失败:', error);
    }
    setTableData((prev: TData[]) => [...newData, ...prev]);
  };
  return copyDataById;
};

/**
 * 在表格开头新增一行的 hook
 * @param setTableData - 设置表格数据的函数
 * @param totalRowInitialData - 所有新行的初始数据
 * @returns 新增行的函数
 */
/**
 * 在表格开头新增一行的 hook
 */
export const useAddRowAtStart = <TData extends Record<string, any> = any>(
  setTableData: React.Dispatch<React.SetStateAction<TData[]>>,
  idName: string,
  totalRowInitialData?: Partial<TData>
) => {
  const addRowAtStart = (len = 1, initialData?: Partial<TData>) => {
    const newRows: TData[] = [];
    for (let i = 0; i < len; i++) {
      newRows.push({
        [idName]: `new-${Date.now()}-${i}`,
        ...(totalRowInitialData || {}),
        ...(initialData || {})
      } as unknown as TData);
    }
    setTableData((prev: TData[]) => [...newRows, ...prev]);
  };

  return addRowAtStart;
};

/**
 * 通过 ids 批量删除表格数据的 hook
 * @param setTableData - 设置表格数据的函数
 * @param idName - id 字段名
 * @returns 删除数据的函数
 */
export const useDeleteDataByIds = <TData extends Record<string, any> = any>(
  setTableData: React.Dispatch<React.SetStateAction<TData[]>>,
  idName: string
) => {
  /**
   * 通过 ids 批量删除数据
   * @param ids - 要删除的 id 数组
   */
  const deleteDataByIds = (ids: (string | number)[]) => {
    setTableData((prev: TData[]) => prev.filter((item: TData) => !ids.includes(item[idName])));
  };
  return deleteDataByIds;
};
