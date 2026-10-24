#!/bin/bash
set -euo pipefail

# Run locally to upload the approved website to the owner's GitHub account.
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd "$(dirname "$0")/.."
owner="ryankongnewkingworld"
repository="$owner/deep-embrace-official"

if ! gh api user --jq .login >/dev/null 2>&1; then
  gh auth login --hostname github.com --git-protocol https --web
fi
actual_owner="$(gh api user --jq .login)"
if [[ "$actual_owner" != "$owner" ]]; then
  echo "当前账号是 $actual_owner，请切换到 $owner 后重试。"
  exit 1
fi

git diff --check
git add app components lib public/media docs scripts supabase .gitignore
if ! git diff --cached --quiet; then
  git commit -m "Polish website, case pages, expert profiles and original brand logos"
fi

remote_url="https://github.com/$repository.git"
if git remote get-url github >/dev/null 2>&1; then
  if [[ "$(git remote get-url github)" != "$remote_url" ]]; then
    echo "已有 github remote 指向其他仓库，已停止，未覆盖。"
    exit 1
  fi
else
  git remote add github "$remote_url"
fi

if ! gh repo view "$repository" >/dev/null 2>&1; then
  gh repo create "$repository" --private --description "深拥智能官方网站：企业AI转型、业务案例与成熟度评估"
fi
gh auth setup-git
git fetch github main
git merge --allow-unrelated-histories --no-edit -X ours github/main
git push github HEAD:main
echo "代码已上传：https://github.com/$repository"
echo "这一步只上传代码。前端仍需发布到支持 Cloudflare Workers 的托管；咨询和评估后端已部署到 Supabase。"
read -r -p "按回车关闭窗口…" _
