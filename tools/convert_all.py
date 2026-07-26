#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键转换所有供应商数据 → JSON
自动检测 Excel 文件位置
"""

import json
import os
import re
import sys
from datetime import datetime

# 检查依赖
try:
    import pandas as pd
except ImportError:
    print('❌ 缺少 pandas 库，请运行: pip install pandas openpyxl')
    sys.exit(1)

# ============================================================
# 自动检测路径
# ============================================================

# 脚本所在目录
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# 项目根目录（脚本的上一级）
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

print(f'📁 项目根目录: {PROJECT_ROOT}')

# 查找 Excel 文件
excel_files = []
for f in os.listdir(PROJECT_ROOT):
    if f.endswith('.xlsx') or f.endswith('.xls'):
        excel_files.append(f)

print(f'📊 找到 {len(excel_files)} 个 Excel 文件:')
for f in excel_files:
    print(f'   - {f}')

if not excel_files:
    print('❌ 没有找到 Excel 文件，请确认文件已放入项目根目录')
    sys.exit(1)

# ============================================================
# 配置
# ============================================================

DATA_DIR = os.path.join(PROJECT_ROOT, 'data')
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(os.path.join(DATA_DIR, 'itinerary'), exist_ok=True)

# ============================================================
# 工具函数
# ============================================================

def parse_price(val):
    """解析价格"""
    if pd.isna(val):
        return None
    if isinstance(val, (int, float)):
        return float(val) if val > 0 else None
    if isinstance(val, str):
        val = val.replace('$', '').replace(',', '').replace('AUD', '').strip()
        try:
            return float(val) if float(val) > 0 else None
        except:
            return None
    return None

def extract_days(title):
    """从标题提取天数"""
    if not title:
        return 0
    title = str(title)
    # 匹配 "8天" "8日" "8天7晚" 等
    match = re.search(r'(\d+)[天日]', title)
    if match:
        return int(match.group(1))
    # 匹配 "D8" 格式
    match = re.search(r'[Dd](\d+)', title)
    if match:
        return int(match.group(1))
    return 0

def extract_region(title):
    """从标题提取区域 - 扩展版"""
    if not title:
        return ''
    title = str(title)
    region_map = {
        '江南': ['江南', '上海', '苏州', '杭州', '南京', '乌镇', '千岛湖', '黄山', '水韵', '华东'],
        '北京': ['北京', '皇城', '首都'],
        '西安': ['西安', '古都', '长安', '兵马俑'],
        '九寨沟': ['九寨沟', '九寨', '川西', '黄龙'],
        '张家界': ['张家界', '天门山', '武陵源'],
        '凤凰': ['凤凰', '湘西'],
        '云南': ['云南', '昆明', '大理', '丽江', '香格里拉', '泸沽湖'],
        '桂林': ['桂林', '阳朔', '漓江'],
        '广东': ['广东', '广州', '大湾区', '潮汕', '岭南', '佛山', '深圳'],
        '厦门': ['厦门', '福建', '土楼', '鼓浪屿', '武夷山'],
        '海南': ['海南', '海口', '三亚', '天涯海角'],
        '新疆': ['新疆', '喀纳斯', '伊犁', '北疆', '南疆', '乌鲁木齐', '喀什'],
        '西藏': ['西藏', '拉萨', '布达拉宫', '林芝'],
        '青海': ['青海', '西宁', '青海湖', '茶卡'],
        '甘肃': ['甘肃', '敦煌', '张掖', '莫高窟', '嘉峪关'],
        '长江三峡': ['长江三峡', '三峡', '游轮', '邮轮'],
        '山东': ['山东', '泰山', '曲阜', '青岛', '济南'],
        '山西': ['山西', '五台山', '平遥', '大同'],
        '东北': ['东北', '长白山', '哈尔滨', '雪乡', '吉林', '沈阳'],
        '河南': ['河南', '少林寺', '洛阳', '开封'],
        '重庆': ['重庆', '武隆', '山城'],
        '贵州': ['贵州', '黄果树', '千户苗寨'],
        '成都': ['成都', '都江堰', '峨眉', '乐山'],
        '日本': ['日本', '东京', '大阪', '京都', '北海道', '富士山'],
        '韩国': ['韩国', '首尔', '釜山', '济州'],
        '台湾': ['台湾', '台北', '高雄', '阿里山', '日月潭'],
        '越南': ['越南', '河内', '下龙湾', '岘港', '胡志明'],
        '泰国': ['泰国', '曼谷', '芭提雅', '普吉', '清迈'],
        '新加坡': ['新加坡', '狮城'],
        '马来西亚': ['马来西亚', '吉隆坡', '沙巴', '槟城'],
        '柬埔寨': ['柬埔寨', '吴哥', '金边'],
        '新西兰': ['新西兰', '奥克兰', '皇后镇', '基督城', '罗托鲁瓦', '南岛', '北岛'],
        '悉尼': ['悉尼', '蓝山', '史蒂芬港'],
        '墨尔本': ['墨尔本', '大洋路', '企鹅岛'],
        '黄金海岸': ['黄金海岸', '布里斯班', '海豚岛'],
        '凯恩斯': ['凯恩斯', '大堡礁', '圣灵群岛', '汉密尔顿'],
        '珀斯': ['珀斯', '西澳', '粉红湖'],
        '塔斯马尼亚': ['塔斯马尼亚', '霍巴特'],
        '阿德莱德': ['阿德莱德', '南澳'],
        '乌鲁鲁': ['乌鲁鲁', '艾尔斯岩', '北领地'],
    }
    for region, keywords in region_map.items():
        for kw in keywords:
            if kw in title:
                return region
    return ''

def detect_tour_type(sheet_name, title, category, product_name):
    """检测团型"""
    title = str(title) if title else ''
    product_name = str(product_name) if product_name else ''
    sheet = str(sheet_name) if sheet_name else ''
    
    if '纯玩' in sheet or 'No Shopping' in sheet or '纯玩' in title or 'no shopping' in product_name.lower():
        return '纯玩无购物团'
    if '超值' in sheet or '特价' in sheet or 'budget' in sheet.lower():
        return '超值特价团'
    if '包机票' in title or '含机票' in title or '包机票' in product_name:
        return '包机票省心团'
    if 'English' in sheet or '英文' in sheet:
        return '常规团'
    if 'Circle' in sheet or '线路' in sheet:
        return '常规团'
    if '纯玩' in category or 'No Shopping' in str(category):
        return '纯玩无购物团'
    if '超值' in category or '特价' in category:
        return '超值特价团'
    return '常规团'

def get_supplier_name(filename):
    """根据文件名识别供应商"""
    name = str(filename).lower()
    if 'funtrip' in name or '趣旅游' in name:
        return '趣旅游'
    if 'nova' in name:
        return '新星假期'
    if 'pv' in name or 'premier' in name:
        return '尊尚假期'
    if '中国美' in name or 'chinamei' in name:
        return '中国美'
    return '未知供应商'

def safe_str(val):
    """安全转字符串"""
    if pd.isna(val):
        return ''
    return str(val).strip()

# ============================================================
# 转换函数
# ============================================================

def convert_funtrip_products():
    """转换 Funtrip 产品"""
    products = []
    file_path = os.path.join(PROJECT_ROOT, 'Funtrip2026_汇总_20260716.xlsx')
    if not os.path.exists(file_path):
        print(f'⚠️ Funtrip 文件不存在，跳过')
        return products
    
    try:
        xl = pd.ExcelFile(file_path)
        sheet_names = xl.sheet_names
        print(f'   Funtrip sheets: {sheet_names}')
        
        for sheet_name in sheet_names:
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            
            # 确定团型
            if '超值' in sheet_name:
                tour_type = '超值特价团'
            elif '纯玩' in sheet_name:
                tour_type = '纯玩无购物团'
            else:
                tour_type = '常规团'
            
            for idx, row in df.iterrows():
                code = safe_str(row.get('行程编号', ''))
                if not code:
                    continue
                
                title = safe_str(row.get('行程标题', ''))
                if not title:
                    continue
                
                products.append({
                    'id': code,
                    'name': title,
                    'supplier': '趣旅游',
                    'supplier_code': code,
                    'tour_type': tour_type,
                    'region': extract_region(title),
                    'country': '中国',
                    'duration_days': extract_days(title),
                    'adult_price': parse_price(row.get('成人价格', 0)),
                    'child_price': parse_price(row.get('孩童占床价格', 0)),
                    'child_no_bed_price': parse_price(row.get('孩童不占床价格', 0)),
                    'service_fee': parse_price(row.get('综合服务费', 0)),
                    'single_supplement': parse_price(row.get('单间差', 0)),
                    'status': 'active',
                    'source': f'Funtrip/{sheet_name}'
                })
            
        print(f'   ✅ Funtrip: {len(products)} 个产品')
    except Exception as e:
        print(f'   ❌ Funtrip 转换失败: {e}')
    
    return products

def convert_nova_products():
    """转换 Nova 产品"""
    products = []
    file_path = os.path.join(PROJECT_ROOT, 'Nova供应商产品表_澳洲新西兰.xlsx')
    if not os.path.exists(file_path):
        print(f'⚠️ Nova 文件不存在，跳过')
        return products
    
    try:
        xl = pd.ExcelFile(file_path)
        sheet_names = xl.sheet_names
        print(f'   Nova sheets: {sheet_names}')
        
        for sheet_name in sheet_names:
            # 跳过说明和单门票
            if '填写说明' in sheet_name or '单门票' in sheet_name:
                continue
            
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            
            # 确定国家
            if '新西兰' in sheet_name:
                country = '新西兰'
            else:
                country = '澳洲'
            
            for idx, row in df.iterrows():
                code = safe_str(row.get('您方产品编号 (团号)', ''))
                if not code:
                    continue
                
                # 跳过没有名称的行
                name = safe_str(row.get('产品名称', ''))
                if not name:
                    continue
                
                products.append({
                    'id': code,
                    'name': name,
                    'supplier': '新星假期',
                    'supplier_code': code,
                    'tour_type': '常规团',
                    'region': safe_str(row.get('所属地区', '')),
                    'country': country,
                    'duration_days': int(row.get('游玩天数', 1)) if not pd.isna(row.get('游玩天数', 1)) else 1,
                    'adult_price': parse_price(row.get('成人零售价 (AUD)', 0)),
                    'child_price': parse_price(row.get('儿童零售价 (AUD)', 0)),
                    'child_no_bed_price': parse_price(row.get('儿童不占床(AUD)', 0)),
                    'infant_price': parse_price(row.get('婴儿零售价 (AUD)', 0)),
                    'single_supplement': parse_price(row.get('单人附加费', 0)),
                    'status': 'active',
                    'source': f'Nova/{sheet_name}',
                    'product_url': safe_str(row.get('详情页核对地址', ''))
                })
            
        print(f'   ✅ Nova: {len(products)} 个产品')
    except Exception as e:
        print(f'   ❌ Nova 转换失败: {e}')
    
    return products

def convert_pv_products():
    """转换 Premier Vacations 产品"""
    products = []
    file_path = os.path.join(PROJECT_ROOT, 'PV 产品汇总.xlsx')
    if not os.path.exists(file_path):
        print(f'⚠️ PV 文件不存在，跳过')
        return products
    
    try:
        xl = pd.ExcelFile(file_path)
        sheet_names = xl.sheet_names
        print(f'   PV sheets: {sheet_names}')
        
        for sheet_name in sheet_names:
            if sheet_name == 'Admin':
                continue
                
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            
            # 判断国家
            country = '其他'
            if 'Sydney' in sheet_name or 'Melbourne' in sheet_name or 'Gold Coast' in sheet_name or 'Cairns' in sheet_name:
                country = '澳洲'
            elif 'New Zealand' in sheet_name:
                country = '新西兰'
            elif 'China' in sheet_name:
                country = '中国'
            elif 'Europe' in sheet_name:
                country = '欧洲'
            elif 'US' in sheet_name or 'Canada' in sheet_name:
                country = '美加'
            elif 'South America' in sheet_name or 'Antactic' in sheet_name:
                country = '其他'
            
            for idx, row in df.iterrows():
                code = safe_str(row.get('Tour Code', ''))
                if not code:
                    continue
                
                name = safe_str(row.get('Country & Tour', ''))
                if not name:
                    continue
                
                # 解析价格
                price_str = safe_str(row.get('Price From', ''))
                price_val = None
                if price_str:
                    match = re.search(r'[\d,]+', price_str)
                    if match:
                        try:
                            price_val = float(match.group().replace(',', ''))
                        except:
                            pass
                
                duration = int(row.get('Duration', 0)) if not pd.isna(row.get('Duration', 0)) else 0
                if duration == 0:
                    duration = extract_days(name)
                
                products.append({
                    'id': code,
                    'name': name,
                    'supplier': '尊尚假期',
                    'supplier_code': code,
                    'tour_type': detect_tour_type(sheet_name, name, '', ''),
                    'region': sheet_name,
                    'country': country,
                    'duration_days': duration,
                    'adult_price': price_val,
                    'child_price': None,
                    'child_no_bed_price': None,
                    'infant_price': None,
                    'single_supplement': None,
                    'status': 'active',
                    'source': f'PV/{sheet_name}'
                })
            
        print(f'   ✅ 尊尚假期: {len(products)} 个产品')
    except Exception as e:
        print(f'   ❌ 尊尚假期 转换失败: {e}')
    
    return products

def convert_china_mei_products():
    """转换中国美产品"""
    products = []
    file_path = os.path.join(PROJECT_ROOT, '中国美_Master_Database.xlsx')
    if not os.path.exists(file_path):
        print(f'⚠️ 中国美文件不存在，跳过')
        return products
    
    try:
        df = pd.read_excel(file_path, sheet_name='Master_Product_Database')
        print(f'   中国美: {len(df)} 行数据')
        
        for idx, row in df.iterrows():
            internal_code = safe_str(row.get('Internal_Product_Code', ''))
            if not internal_code:
                continue
            
            name = safe_str(row.get('Product_Name_CN', ''))
            if not name:
                continue
            
            # 判断团型
            category = safe_str(row.get('Product_Category', ''))
            tour_type = detect_tour_type('', name, category, name)
            
            # 判断区域
            region = safe_str(row.get('Region', ''))
            if region == '中国':
                region_name = extract_region(name)
            else:
                region_name = region
            
            # 判断国家
            country = '中国'
            if region in ['亚洲', '美加', '欧洲', '海岛', '全球签证']:
                country = region
            
            duration = int(row.get('Duration_Days', 0)) if not pd.isna(row.get('Duration_Days', 0)) else 0
            if duration == 0:
                duration = extract_days(name)
            
            products.append({
                'id': internal_code,
                'name': name,
                'supplier': '中国美',
                'supplier_code': safe_str(row.get('Supplier_Product_Code', '')),
                'internal_code': internal_code,
                'tour_type': tour_type,
                'region': region_name or region,
                'country': country,
                'duration_days': duration,
                'adult_price': parse_price(row.get('Adult_Price_AUD', 0)),
                'child_price': parse_price(row.get('Child_With_Bed_AUD', 0)),
                'child_no_bed_price': parse_price(row.get('Child_Price_AUD', 0)),
                'infant_price': parse_price(row.get('Infant_Price_AUD', 0)),
                'single_supplement': parse_price(row.get('Single_Supplement_AUD', 0)),
                'status': 'active',
                'source': '中国美',
                'remarks': safe_str(row.get('Remarks', ''))
            })
            
        print(f'   ✅ 中国美: {len(products)} 个产品')
    except Exception as e:
        print(f'   ❌ 中国美 转换失败: {e}')
    
    return products

# ============================================================
# 主程序
# ============================================================

def main():
    print('=' * 60)
    print('🚀 开始转换所有供应商数据...')
    print('=' * 60)
    print(f'📁 工作目录: {PROJECT_ROOT}')
    print('')
    
    all_products = []
    
    # 按顺序转换
    print('📊 正在转换 Funtrip...')
    all_products.extend(convert_funtrip_products())
    
    print('📊 正在转换 Nova...')
    all_products.extend(convert_nova_products())
    
    print('📊 正在转换 尊尚假期...')
    all_products.extend(convert_pv_products())
    
    print('📊 正在转换 中国美...')
    all_products.extend(convert_china_mei_products())
    
    # 去重
    seen = set()
    unique = []
    for p in all_products:
        key = (p['id'], p['supplier'])
        if key not in seen:
            seen.add(key)
            unique.append(p)
    
    # 排序：邮轮优先
    cruise = [p for p in unique if '邮轮' in p['name'] or '游轮' in p['name'] or 'cruise' in p['name'].lower()]
    others = [p for p in unique if p not in cruise]
    sorted_products = cruise + others
    
    # 保存主文件
    main_file = os.path.join(DATA_DIR, 'products.json')
    with open(main_file, 'w', encoding='utf-8') as f:
        json.dump(sorted_products, f, ensure_ascii=False, indent=2)
    
    # 按分类拆分
    categories = {}
    for p in sorted_products:
        country = p.get('country', '其他')
        tour_type = p.get('tour_type', '常规团')
        
        # 邮轮特殊处理
        if '邮轮' in p['name'] or '游轮' in p['name']:
            key = '邮轮'
        elif country == '中国':
            if '纯玩' in tour_type:
                key = '中国-纯玩无购物'
            elif '包机票' in tour_type:
                key = '中国-包机票'
            else:
                key = '中国-超值特价'
        else:
            key = country
        
        if key not in categories:
            categories[key] = []
        categories[key].append(p)
    
    # 保存分类文件
    for name, prods in categories.items():
        if prods:
            filename = name.replace(' ', '_').replace('-', '_').lower() + '.json'
            filepath = os.path.join(DATA_DIR, filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(prods, f, ensure_ascii=False, indent=2)
    
    # 统计
    print('')
    print('=' * 60)
    print('📊 转换完成！统计信息：')
    print(f'  总产品数: {len(sorted_products)}')
    print(f'  去重前: {len(all_products)}')
    print('')
    print('  按分类:')
    for name, prods in sorted(categories.items(), key=lambda x: -len(x[1])):
        print(f'    - {name}: {len(prods)} 个')
    print('')
    print(f'📁 数据已保存到: {DATA_DIR}')
    print('=' * 60)
    print('✅ 完成！')

if __name__ == '__main__':
    main()