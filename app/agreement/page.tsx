import React from "react";

export default function AgreementPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-zinc-100">
      <h1 className="text-2xl font-bold mb-4">사이트 이용약관</h1>
      <p className="mb-2 text-sm text-zinc-400">본 약관은 2025년 05월 07일부터 적용됩니다.</p>
      <h2 className="font-semibold mt-6 mb-2">목적</h2>
      <p className="mb-2">이 약관은 BDOPonyang(이하 "사이트")에서 제공하는 게임 정보/커뮤니티 서비스 및 이에 부수된 제반 서비스(이하 '서비스')의 이용과 관련하여, 사이트와 이용자 간에 서비스 이용에 관한 권리 및 의무와 책임사항, 기타 필요한 사항을 규정하는 것을 목적으로 합니다.</p>
      <h2 className="font-semibold mt-6 mb-2">약관의 게시와 효력, 개정</h2>
      <ol className="list-decimal pl-6 mb-2">
        <li>사이트는 서비스의 가입 과정에서 이용자에게 본 약관을 제시하고, 서비스 홈페이지에 본 약관을 게시합니다.</li>
        <li>사이트는 관련법에 위배되지 않는 범위에서 본 약관을 변경할 수 있습니다.</li>
        <li>약관 개정 시 적용일자, 개정내용, 개정사유 등을 명시하여 최소 7일 전(중대한 변경은 30일 전)부터 공지합니다.</li>
        <li>이용자는 변경된 약관에 동의하지 않을 권리가 있으며, 동의하지 않을 경우 서비스 이용 중단 및 탈퇴를 요청할 수 있습니다. 별도 의사표시가 없을 경우 동의한 것으로 간주할 수 있습니다.</li>
      </ol>
      <h2 className="font-semibold mt-6 mb-2">약관의 해석과 예외 준칙</h2>
      <ol className="list-decimal pl-6 mb-2">
        <li>사이트는 개별 서비스에 대해 별도의 이용약관 및 정책을 둘 수 있으며, 상충 시 개별 약관이 우선합니다.</li>
        <li>본 약관에 명시되지 않은 사항은 관계법령에 따릅니다.</li>
      </ol>
      <h2 className="font-semibold mt-6 mb-2">용어의 정의</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>서비스: BDOPonyang에서 제공하는 게임 정보/커뮤니티 및 이에 부수된 제반 서비스</li>
        <li>이용자: 사이트와 서비스 이용계약을 체결하고 서비스를 이용하는 모든 사용자</li>
        <li>아이디: 이용자 식별 및 서비스 이용을 위해 부여된 문자/숫자 조합</li>
        <li>비밀번호: 이용자 본인 확인 및 정보 보호를 위한 문자/숫자 조합</li>
        <li>게시물: 이용자가 서비스 내에 게시한 모든 정보(텍스트, 이미지, 링크 등)</li>
      </ul>
      <h2 className="font-semibold mt-6 mb-2">이용계약의 체결</h2>
      <ol className="list-decimal pl-6 mb-2">
        <li>이용계약은 이용자가 약관에 동의 후 서비스 이용을 신청하고, 사이트가 이를 승낙함으로써 체결됩니다.</li>
        <li>이용자는 본인의 실제 정보를 기재해야 하며, 허위 정보 또는 타인 정보 도용 시 권리를 주장할 수 없습니다.</li>
        <li>사이트는 설비 여유, 기술적 장애, 정책상 부적합 등 사유로 승낙을 유보/거절할 수 있습니다.</li>
        <li>이용자는 언제든지 탈퇴를 요청할 수 있습니다.</li>
      </ol>
      <h2 className="font-semibold mt-6 mb-2">개인정보보호 의무</h2>
      <ol className="list-decimal pl-6 mb-2">
        <li>사이트는 관련 법령 및 개인정보처리방침에 따라 이용자의 개인정보를 보호합니다.</li>
        <li>서비스 중단 또는 동의 철회 시 신속히 개인정보를 파기합니다. 단, 법령에 따라 일정 기간 보관할 수 있습니다.</li>
        <li>법률상 특별한 규정이 없는 한, 별도 동의 없이 개인정보를 제3자에게 제공하지 않습니다.</li>
      </ol>
      <h2 className="font-semibold mt-6 mb-2">이용자의 아이디 및 비밀번호</h2>
      <ol className="list-decimal pl-6 mb-2">
        <li>이용자는 아이디와 비밀번호 관리 책임이 있습니다.</li>
        <li>도용, 유출, 부정 사용 시 즉시 사이트에 통지해야 하며, 관리 소홀로 인한 손해는 이용자 책임입니다.</li>
      </ol>
      <h2 className="font-semibold mt-6 mb-2">사이트의 의무</h2>
      <ol className="list-decimal pl-6 mb-2">
        <li>지속적이고 안정적인 서비스 제공을 위해 노력합니다.</li>
        <li>이용자 불만이 정당할 경우 신속히 처리합니다.</li>
        <li>관련 법령을 준수합니다.</li>
      </ol>
      <h2 className="font-semibold mt-6 mb-2">이용자의 의무</h2>
      <ol className="list-decimal pl-6 mb-2">
        <li>허위 정보 등록, 타인 정보 도용, 불법/부적절한 게시물 작성, 해킹, 영리/광고 목적 사용 등 금지</li>
        <li>약관, 공지사항, 법령 등 준수</li>
        <li>위반 시 서비스 이용 제한, 게시물 삭제, 탈퇴 등 조치 가능</li>
      </ol>
      <h2 className="font-semibold mt-6 mb-2">서비스의 제공 및 변경</h2>
      <ol className="list-decimal pl-6 mb-2">
        <li>사이트는 서비스의 형태, 기능, 디자인 등을 수시로 변경/중단할 수 있습니다.</li>
        <li>무료 서비스 변경/중단 시 손해에 대해 책임지지 않습니다.</li>
      </ol>
      <h2 className="font-semibold mt-6 mb-2">게시물의 관리 및 권리</h2>
      <ol className="list-decimal pl-6 mb-2">
        <li>이용자가 작성한 게시물의 권리와 책임은 작성자에게 있습니다.</li>
        <li>사이트는 법령, 약관, 정책 위반 게시물에 대해 삭제/이동/등록 거부 등 조치를 할 수 있습니다.</li>
        <li>이용자는 게시물에 대한 저작권 등 권리를 침해하지 않아야 하며, 침해 시 모든 책임은 이용자에게 있습니다.</li>
      </ol>
      <h2 className="font-semibold mt-6 mb-2">광고의 게재</h2>
      <ol className="list-decimal pl-6 mb-2">
        <li>사이트는 서비스 운영과 관련하여 광고를 게재할 수 있습니다.</li>
        <li>광고 참여, 거래 등으로 인한 손해에 대해 책임지지 않습니다.</li>
      </ol>
      <h2 className="font-semibold mt-6 mb-2">책임제한</h2>
      <ol className="list-decimal pl-6 mb-2">
        <li>이용자의 귀책사유, 무료 서비스, 불가항력 등으로 인한 손해에 대해 책임지지 않습니다.</li>
        <li>게시물, 정보, 자료의 신뢰성, 정확성 등에 대해 보증하지 않습니다.</li>
        <li>이용자 간 또는 이용자와 제3자 간 분쟁에 대해 책임지지 않습니다.</li>
      </ol>
      <h2 className="font-semibold mt-6 mb-2">준거법 및 재판관할</h2>
      <ol className="list-decimal pl-6 mb-2">
        <li>본 약관은 대한민국법을 준거법으로 합니다.</li>
        <li>사이트와 이용자 간 분쟁에 관한 소송의 관할법원은 민사소송법 상의 관할법원으로 합니다.</li>
      </ol>
    </div>
  );
} 