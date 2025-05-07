import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-zinc-100">
      <h1 className="text-2xl font-bold mb-4">개인정보 처리방침</h1>
      <p className="mb-2 text-sm text-zinc-400">최종 업데이트: 2025년 05월 07일</p>
      <p className="mb-4">
        본 개인정보 처리방침은 BDOPonyang(이하 "사이트")에서 귀하의 개인정보를 어떻게 수집, 이용, 보관, 보호하는지 안내합니다. 본 사이트를 이용함으로써 본 방침에 동의하는 것으로 간주합니다.
      </p>
      <h2 className="font-semibold mt-6 mb-2">1. 총칙</h2>
      <p className="mb-2">
        본 사이트는 1인 개발자가 운영하는 비공식 게임 정보/커뮤니티 서비스입니다. 이용자 중심의 편리한 기능 제공을 목표로 하고 있습니다. 본 방침은 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보 보호법 등 관련 법령을 준수합니다.
      </p>
      <h2 className="font-semibold mt-6 mb-2">2. 개인정보 수집에 대한 동의</h2>
      <p className="mb-2">
        사이트는 이용자가 개인정보 처리방침 또는 이용약관에 동의할 수 있는 절차를 마련하며, 동의 버튼을 클릭하면 개인정보 수집에 동의한 것으로 봅니다.
      </p>
      <h2 className="font-semibold mt-6 mb-2">3. 수집하는 개인정보 항목 및 수집·이용 목적</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>커뮤니티(게시판, 댓글, 문의) 이용 시: 닉네임, 이메일(선택), 작성 내용 등</li>
        <li>광고, 후원, 유료서비스 이용 시: 결제 관련 정보(결제사, 후원사 등에서 직접 수집)</li>
        <li>서비스 이용 시: IP 주소, 브라우저/기기 정보, 방문 기록, 쿠키 등</li>
        <li>구글 애널리틱스, 광고 등 외부 서비스 이용 시: 쿠키, 트래킹 정보</li>
      </ul>
      <p className="mb-2">수집된 정보는 커뮤니티 서비스 제공, 광고/후원/유료서비스 제공, 서비스 개선, 통계 분석, 보안 및 부정 이용 방지, 법적 의무 이행 및 분쟁 대응 목적으로만 사용됩니다.</p>
      <h2 className="font-semibold mt-6 mb-2">4. 개인정보 보유 및 이용 기간</h2>
      <p className="mb-2">게시글, 댓글, 문의 등은 삭제 요청 시 또는 서비스 종료 시까지 보관 후 파기합니다. 결제/후원 정보는 관련 법령에 따라 일정 기간 보관 후 파기합니다. 로그, 쿠키 등은 통계 분석 및 보안 목적 달성 시까지 보관 후 파기합니다.</p>
      <h2 className="font-semibold mt-6 mb-2">5. 개인정보의 제3자 제공 및 처리위탁</h2>
      <p className="mb-2">원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 단, 광고, 후원, 유료서비스 결제 등 서비스 제공을 위해 필요한 경우, 이용자의 동의를 받아 결제사, 광고사 등 제3자에게 제공할 수 있습니다. 구글 애널리틱스, 광고 등 외부 서비스는 각 서비스의 개인정보 처리방침을 따릅니다.</p>
      <h2 className="font-semibold mt-6 mb-2">6. 개인정보의 파기 절차 및 방법</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>전자적 파일 형태는 복구 불가능한 방법으로 즉시 삭제</li>
        <li>게시글, 댓글 등은 삭제 요청 시 즉시 파기</li>
      </ul>
      <h2 className="font-semibold mt-6 mb-2">7. 쿠키, 분석 및 광고</h2>
      <p className="mb-2">사이트는 서비스 개선, 광고 제공, 통계 분석을 위해 쿠키 및 유사 기술을 사용합니다. 구글 애널리틱스, 광고(애드센스 등), 기타 외부 서비스에서 쿠키 및 트래킹 정보를 수집할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 단, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.</p>
      <h2 className="font-semibold mt-6 mb-2">8. 외부 서비스 및 애플리케이션</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>Google Analytics: 방문자 통계 및 분석</li>
        <li>광고 플랫폼(예: 애드센스, NitroPay 등): 광고 제공</li>
        <li>결제/후원 플랫폼(예: 카카오페이, Toss, Paddle 등): 결제 및 후원 처리</li>
        <li>Cloudflare 등 CDN/보안 서비스: 사이트 속도 및 보안 강화</li>
        <li>Discord 등 커뮤니티/문의 플랫폼: 사용자 문의 및 소통</li>
      </ul>
      <h2 className="font-semibold mt-6 mb-2">9. 정보보호 및 안전성</h2>
      <p className="mb-2">사이트는 개인정보 보호를 위해 합리적인 기술적/관리적 보호조치를 시행합니다. 단, 해킹, 비인가 접근 등 예기치 못한 사고에 대해서는 100% 보안을 보장할 수 없습니다.</p>
      <h2 className="font-semibold mt-6 mb-2">10. 이용자의 권리</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>언제든지 본인이 작성한 게시글, 댓글, 문의 내역을 조회, 수정, 삭제 요청할 수 있습니다.</li>
        <li>개인정보 관련 문의는 아래 이메일로 연락해 주세요.</li>
      </ul>
      <h2 className="font-semibold mt-6 mb-2">11. 방침 변경 안내</h2>
      <p className="mb-2">본 방침은 법령, 서비스 정책 변경에 따라 사전 고지 없이 변경될 수 있습니다. 변경 시 본 페이지에 즉시 반영하며, 상단의 "최종 업데이트" 날짜를 확인해 주세요.</p>
      <h2 className="font-semibold mt-6 mb-2">12. 문의처</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>이메일: ponyang.dev@gmail.com</li>
        <li>Discord 문의: https://discord.gg/a6GywfJr</li>
      </ul>
      <h2 className="font-semibold mt-6 mb-2">13. 정보 주체의 권익침해에 대한 구제방법</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>개인정보 침해신고센터 (한국인터넷진흥원): privacy.kisa.or.kr / 국번없이 118</li>
        <li>개인정보 분쟁조정위원회: www.kopico.go.kr / 02-2100-2499</li>
        <li>대검찰청 사이버범죄수사단: www.spo.go.kr / 02-3480-3571</li>
        <li>경찰청 사이버안전국: cyberbureau.police.go.kr / 국번없이 182</li>
      </ul>
    </div>
  );
} 