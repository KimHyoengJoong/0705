// http://localhost:5500/contacts?pageno=값
function getPageno() {
    // get방식의 querrystring을 읽을 수 있는 객체 생성
    const param = new URLSearchParams(location.search);
    const pageno = parseInt(param.get('pageno'));

    // pageno가 없거나 숫자로 바꿀 수 없는 값인 경우 parseInt의 결과는 NaN(Not a Number)
    // NaN를 비교하면 무조건 false(JS에서 NaN는 비교되는 값이 아니다)
    // NaN와 비교할때는 isNaN() 함수를 사용해야 한다
    if (isNaN(pageno))
        return 1;
    else if (pageno < 1)
        return 1;
    return pageno;
}

// 기본 매개변수(default parameter)
async function fetch(pageno = 1, pagesize = 10) {
    const api = 'http://sample.bmaster.kro.kr/contacts';
    const url = `${api}?pageno=${pageno}&pagesize=${pagesize}`;
    // $.ajax()는 병렬처리(비동기 처리)되는 코드 → 언제 끝날지 모른다
    // 비동기코드를 리턴받는 result는 "미래에 값이 들어올 것이다"란 값을 가진다
    // (Promise)

    try {
        return await $.ajax(url);
    } catch (err) {
        console.log(err)
        return null;
    }
}

function printContacts(contacts) {
    const $parent = $('#tbody');
    for (c of contacts) {
        const html = `
        <tr>
          <td>${c.no}</td>
          <td><a href='read.html?no=${c.no}'>${c.name}</a></td>
          <td>${c.tel}</td>
          <td>${c.address}</td>
        </tr>
      `;
        $parent.append(html);
    }
}


// pagination에 필요한 prev, start, end, next, pageno를 리턴하는 함수

// getPagination(result) → result에서 pageno, pagesize, totalcount를 꺼내는 문법
// 구조분해할당
function getPagination({ pageno, pagesize, totalcount, blockSize = 5 }) {
    // 페이지의 개수 계산
    const countOfPage = Math.ceil(totalcount / pagesize);

    // prev, start, end, next를 계산한 다음 목록의 끝에 도달할 경우 end, next를 변경
    const prev = Math.floor((pageno - 1) / blockSize) * blockSize;
    const start = prev + 1;
    let end = prev + blockSize;
    let next = end + 1;
    if (end >= countOfPage) {
        end = countOfPage;
        next = 0;
    }
    // 구조분해할당 : 객체 → 변수로 분해, 변수를 모아서 객체를 생성
    // return {prev:prev, start:start, end:end, next:next, pageno:pageno};
    return { prev, start, end, next, pageno };
}

function printPagination({ prev, start, end, next, pageno }) {
    const $parent = $('#pagination');
    if (prev > 0) {
        const html = `
        <li class="page-item">
            <a href="list.html?pageno=${prev}" class="page-link">이전으로</a>
        </li>
        `;
        $parent.append(html);
    }

    for (let i = start; i <= end; i++) {
        let classname = 'page-item';
        if (i === pageno)
            classname = 'page-item active'
        const html = `
        <li class="${classname}">
            <a href="list.html?pageno=${i}" class="page-link">${i}</a>
        </li>
        `;
        $parent.append(html);
    }
    if (next > 0) {
        const html = `
        <li class="page-item">
            <a href="list.html?pageno=${next}" class="page-link">다음으로</a>
        </li>
        `;
        $parent.append(html);
    }
}