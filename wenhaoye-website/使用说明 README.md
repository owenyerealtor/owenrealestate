# Wenhao Ye 网站 · 使用说明

## 文件结构
```
site/                  ← 整个网站（上线的就是这个文件夹）
  index.html  styles.css  script.js
  images/              ← 图片；后台上传的照片在 images/uploads/
  content/site.json    ← 所有文字（中英文）、电话、链接、图片设置
  content/gallery.json ← 作品相册
  admin/               ← 管理后台 (网址/admin/)
  CNAME                ← 自定义域名（绑定域名时填写）
.github/workflows/pages.yml ← 每次保存后自动发布
```

## 一次性设置（约 15 分钟）
1. 注册 GitHub 账号 https://github.com/signup （免费）。
2. 新建仓库 `website`（Public），把本文件夹全部内容上传进去。
3. 仓库 Settings → Pages → Source 选 **GitHub Actions**。
   约 1 分钟后网站上线：`https://您的用户名.github.io/website/`
4. 打开 `site/admin/config.yml`，把 `OWNER/REPO` 改成 `您的用户名/website`，
   把 `SITE_URL` 改成您的网址。

## 绑定自己的域名（例如 wenhaoye.com）
1. 在 Cloudflare / Namecheap / GoDaddy 购买域名（约 $10–20/年）。
2. 在域名 DNS 中添加：
   - `A` 记录 `@` → 185.199.108.153、185.199.109.153、185.199.110.153、185.199.111.153
   - `CNAME` 记录 `www` → `您的用户名.github.io`
3. 新建文件 `site/CNAME`，内容只写一行：`wenhaoye.com`
4. 仓库 Settings → Pages → Custom domain 填 `wenhaoye.com`，勾选 **Enforce HTTPS**。

## 日常修改（管理后台）
1. 打开 `您的网址/admin/`
2. 点 **Sign In Using Access Token**（使用访问令牌登录）→ 按提示点链接到 GitHub 生成令牌 → 复制粘贴回来。
   只需登录一次，之后浏览器会记住。
3. 左侧菜单：
   - **📷 作品相册**：添加照片、选分类、写中英文标题、拖动排序、删除
   - **📝 网站内容**：电话 / 邮箱 / 微信、头像与各业务图片、全站所有中英文文字
4. 点 **Save（保存）**，约 1 分钟后网站自动更新。

提示：文字里可以用 `<br>` 换行。
