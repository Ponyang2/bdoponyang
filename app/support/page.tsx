import React from "react";

export default function SupportPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-zinc-100">
      <h1 className="text-2xl font-bold mb-4">광고 · 후원 안내 및 문의</h1>
      <p className="mb-4">
        <b>BDOPonyang</b>은 검은사막 모험가분들이 더 쉽고, 더 재미있게 게임을 즐기실 수 있도록 만든 비공식 개인 사이트입니다.<br /><br />
        사이트의 모든 서비스는 무료로 제공되며, 광고 및 후원은 사이트 운영비(서버비, 도메인, 개발 등)로만 사용됩니다.<br /><br />
        광고 게재, 후원, 제휴, 기타 문의는 아래 안내를 참고해 주세요.
      </p>

      <h2 className="font-semibold mt-8 mb-2">광고 문의</h2>
      <p className="mb-2">
        - 배너 광고, 제휴, 이벤트 등 다양한 형태의 광고 문의를 환영합니다.<br />
        - 광고 단가, 위치, 기간 등은 협의 후 결정됩니다.<br />
        - 광고는 검은사막 및 게이머 커뮤니티에 적합한 내용만 게재 가능합니다.<br />
        <span className="text-zinc-400 text-sm">※ 부적절한 광고(불법, 사행성, 선정성 등)는 사전 통보 없이 거절될 수 있습니다.</span>
      </p>

      <h2 className="font-semibold mt-8 mb-2">후원 안내</h2>
      <p className="mb-2">
        - 사이트 발전과 안정적인 운영을 위해 후원을 받고 있습니다.<br />
        - 후원금은 사이트 운영비(서버, 도메인, 개발 등)로 사용됩니다.<br />
        - 후원자분들께는 아래와 같은 작은 혜택을 제공해 드릴 예정입니다.
      </p>
      <div className="my-4 flex items-center justify-center">
        <div className="bg-zinc-800 border border-zinc-600 rounded-lg px-6 py-4 text-center shadow-md">
          <div className="text-sm text-zinc-400 mb-1">후원 계좌</div>
          <div className="text-lg font-bold tracking-widest text-white-300">새마을금고 9003-2947-5099-1</div>
          <div className="text-sm text-zinc-300 mt-1">예금주: 김정수</div>
        </div>
      </div>
      <div className="mb-4 text-zinc-400 text-sm">
        <b>※ 입금 시 입금자명은 반드시 본인의 가문명 또는 길드명으로 입력해 주세요.</b><br />
        (추후 후원자 혜택 적용 및 명예의 전당 등 기록에 활용될 수 있습니다.)
      </div>
      <div className="mb-4 text-zinc-400 text-sm">
        <b>※ 광고/후원 주의사항</b><br />
        - 후원금은 환불이 불가하니 신중하게 결정해 주세요.<br />
        - 부적절한 광고(불법, 사행성, 선정성 등)는 사전 통보 없이 거절될 수 있습니다.<br />
        - 후원 및 광고 관련 문의는 이메일 또는 디스코드로 언제든 연락해 주세요.<br />
      </div>

      <h2 className="font-semibold mt-8 mb-2">후원자 혜택 (예정)</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>사이트 내 <b>후원자 뱃지</b> 표시 (닉네임 옆, 댓글/게시판 등)</li>
        <li>후원자 전용 <b>광고 미노출</b> 기능 (로그인/인증 시)</li>
        <li>후원자 전용 <b>테마/컬러</b> 선택 기능</li>
        <li>후원자 전용 <b>이름/메시지</b> 사이트 내 명예의 전당(후원자 리스트) 노출</li>
        <li>신규 기능/이벤트 우선 체험 기회</li>
        <li>추가 아이디어: 길드/캐릭터 프로필 꾸미기, 후원자 전용 이모티콘 등</li>
      </ul>
      <p className="mb-2 text-zinc-400 text-sm">
        ※ 위 혜택은 개발 상황에 따라 변경될 수 있으며, 후원자분들의 의견을 적극 반영해 개선하겠습니다.
      </p>

      <h2 className="font-semibold mt-8 mb-2">문의 방법</h2>
      <ul className="list-disc pl-6 mb-2">
        <li>이메일: <b>ponyang.dev@gmail.com</b></li>
        <li>디스코드: <a href="https://discord.gg/a6GywfJr" className="text-blue-400 underline">BDOPonyang 공식 디스코드</a></li>
      </ul>
      <p className="mb-2 text-zinc-400 text-sm">
        문의 시, 광고/후원/제휴 등 구체적인 내용을 함께 남겨주시면 더욱 빠른 안내가 가능합니다.
      </p>
    </div>
  );
} 