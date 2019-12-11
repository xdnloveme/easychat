module.exports = {
  html(key, username) {
    const html = `<p>
            您的账号还未激活，请点击下列链接进行激活
            <a href="${server_url}api/user/public/active?username=${username}&active_key=${key}">点击激活</a>
        </p>`;
    return html;
  },
};
