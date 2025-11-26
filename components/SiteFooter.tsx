"use client";

import React from "react";
import Link from "next/link";
import { Apple, Mail } from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "功能特色", href: "#features" },
      { label: "下载", href: "#download" },
      { label: "常见问题", href: "#faq" },
    ],
    support: [
      { label: "帮助中心", href: "#" },
      { label: "隐私政策", href: "#" },
      { label: "服务条款", href: "#" },
    ],
  };

  return (
    <footer className="bg-fg-default text-fg-inverse py-xxl">
      <div className="container max-w-container mx-auto px-md">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-xl mb-xl">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-md">挥拍日记</h3>
            <p className="text-fg-subtle mb-lg max-w-md leading-normal">
              和大自然一起，记录每次挥拍的精彩瞬间。Apple Watch 数据自动导入，AI 生成比赛集锦。
            </p>
            <div className="flex items-center gap-sm">
              <Link
                href="#"
                className="p-sm rounded-md hover:bg-opacity-20 hover:bg-fg-inverse transition-colors duration-base ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-inverse rounded-md"
                aria-label="下载 iOS 版本"
              >
                <Apple size={24} />
              </Link>
              <Link
                href="#"
                className="p-sm rounded-md hover:bg-opacity-20 hover:bg-fg-inverse transition-colors duration-base ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-inverse rounded-md"
                aria-label="邮件联系"
              >
                <Mail size={24} />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-md">产品</h4>
            <ul className="space-y-sm">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-fg-subtle hover:text-fg-inverse transition-colors duration-base ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-inverse rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-md">支持</h4>
            <ul className="space-y-sm">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-fg-subtle hover:text-fg-inverse transition-colors duration-base ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-inverse rounded-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright & Legal Info */}
        <div className="border-t border-fg-subtle pt-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-md">
            <div className="flex flex-col gap-xs">
              <p className="text-fg-subtle text-base">
                © {currentYear} 挥拍科技. All rights reserved.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-xs sm:gap-md text-sm text-fg-subtle">
                <span>
                  备案号：<a 
                    href="https://beian.miit.gov.cn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-fg-inverse transition-colors duration-base ease"
                  >
                    浙ICP备2025204863号-1
                  </a>
                </span>
                <span className="hidden sm:inline">|</span>
                <span>地址：浙江省杭州市余杭区仓前街道龙园路88号</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
