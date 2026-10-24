# Supabase 后端部署状态

项目：DeepEmbraceWEB / `hlhtpykjthoqzgetdnzs`（用户创建，Tokyo，Free）。
控制台：https://supabase.com/dashboard/project/hlhtpykjthoqzgetdnzs

## 已完成

- 私有 schema `deep_embrace_private`、加密咨询表、索引及 `deep_embrace_store` RPC 已在 SQL Editor 执行成功。
- 表开启 RLS，无匿名/登录访客策略；RPC 仅授予 service_role。
- 同一提交者写入使用事务锁，避免并发绕过频率限制。
- 共用现有网站评分、报告签名、AES-GCM、管理员验证与飞书通知代码。
- `node scripts/build-supabase.mjs` 生成单文件 Edge Function。
- `node scripts/test-supabase-api.mjs` 验证来源限制、后台认证、加密、去重及报告凭证。测试数据库传输使用模拟，不能代替远程验收。
- 前端可通过 `NEXT_PUBLIC_BACKEND_URL` 切换后端；未设置时仍使用原同源 API。
- 已创建飞书群「深拥智能｜官网咨询跟进」，会话 ID `oc_c17348c3be2fdeb5c28735bcb46881d2`，初始仅用户本人。
- 已创建群自定义机器人「深拥智能官网助手」，启用签名验证；Webhook 和签名密钥仅保存于服务端。
- 已发布 `website-api`：https://hlhtpykjthoqzgetdnzs.supabase.co/functions/v1/website-api
- 已保存六项 Secrets：`LEAD_ENCRYPTION_KEY`、`LEAD_HASH_SECRET`、`ADMIN_TOKEN`、`ALLOWED_ORIGINS`、`FEISHU_WEBHOOK_URL`、`FEISHU_WEBHOOK_SECRET`。`SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY` 使用 Edge Runtime 自带配置；不放前端。
- 公开咨询接口使用函数自定义来源/凭证验证，部署配置为 `verify_jwt=false`。报告仍需独立随机令牌，管理员仍需 Bearer 密钥。来源校验不是防机器人认证。
- 本地 `.env.local` 已设置公开后端地址；密钥备份 `.env.supabase.local` 已忽略，不得提交 Git。

## 云端验收（2026-10-25，北京时间）

通过 Supabase 控制台 Test 界面调用已部署接口，使用 `Origin: http://localhost:5173` 与 `route` 查询参数（与正常路径共用处理器）：

- 配置检查 200：`available=true`、`notificationConfigured=true`。
- 完整 13 项评估返回 200，生成签名评估。当前使用固定评分规则，未调用外部 AI 模型。
- 测试咨询保存成功；预约编号 `1db6fac8-0b13-4560-8813-5fdb3b442584`，通知状态 `sent`。
- 飞书原生客户端已实际显示该机器人消息，包含测试联系方式、需求与评估提醒。
- 重复提交返回同一预约编号；后台只有一条测试记录。
- 有效报告凭证返回 HTML 200，报告不含测试联系电话；无效凭证返回 403。
- 未授权后台读取返回 401；有效管理员凭证读取返回 200，数据正常解密，响应不包含报告访问令牌。
- 测试记录明确标记为「系统测试，请勿跟进」，保留作为验收凭据，未执行删除。
- TypeScript 检查与本地自动验证通过。远程通知失败重试未做故障注入验证；未配置自动重试调度。

## 尚待完成

- 将更新后的官网前端重新构建、发布，构建时设置 `NEXT_PUBLIC_BACKEND_URL=https://hlhtpykjthoqzgetdnzs.supabase.co/functions/v1/website-api`，并将最终官网 Origin 加入 `ALLOWED_ORIGINS`。
- 当前来源白名单为本地 5173 两个地址和既有 ChatGPT Site 域名；新正式域名尚未确定。
- 本地预览本次被环境禁止监听端口（EPERM）；已用云端 Test 面板验证后端，但尚未完成新版公开网站表单的浏览器验收。
- GitHub 仓库创建/推送与新版前端网址发布尚未完成；当前本地仓库未配置 remote。

现有 D1 数据未迁移；不能直接换掉原站配置后声称旧报告依然可用。加密密钥换新会导致旧资料不可解密。正式切换前需确认是否存在需保留的真实记录。

匿名不留联系方式的评估继续在浏览器展示，不自动向飞书发送；提交联系方式并同意后，才保存资料并发送跟进通知。

GitHub 负责代码版本；Supabase 负责数据库与 API。当前 Vinext 官网前端仍需另行完成可访问网址的托管，增加后端不等于整个网站已经上线。
