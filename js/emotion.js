window.addEventListener("load",()=>{
      const dateInput = document.querySelector("#date");
      const moodInput = document.querySelector("#mood");
      const weatherInput = document.querySelector("#weather");
      const contentInput = document.querySelector("#content");
      const saveBtn = document.querySelector("#saveBtn");
      const cards = document.querySelector("#cards");
      const allDeleteBtn = document.querySelector("#allDeleteBtn");
      const totalCount = document.querySelector("#totalCount");
      const recentMood = document.querySelector(".recentMood");


      // 수정할 글의 id를 저장하는 변수
      let editId = null
      // 오늘 날짜 자동 입력
      // toISOString() : 날짜를 국제 표준 형식으로 바꿈
      dateInput.value = new Date().toISOString().split("T")[0]
      // 오늘 이후 날짜는 비활성화
      dateInput.max = new Date().toISOString().split("T")[0]
      // 로컬스토리지에 저장된 데이터가 없으면 []
      let diary = JSON.parse(localStorage.getItem("diary")) || []
      // 브라우저 첫 화면 데이터 출력
      render()

      // 저장 버튼 클릭하면 ====================================
      saveBtn.addEventListener("click", (e)=>{
        e.preventDefault()
        // 사용자가 아무것도 작성하지않으면
        if(contentInput.value.trim() === ""){
            alert("내용을 작성해 주세요!")
            return // 함수 종료
        }
        // 사용자가 입력한 데이터를 객체로 만들기
        const data = {
            id : Date.now(),
            // 선택한 날짜
            date : dateInput.value,
            // 선택한 기분
            mood : moodInput.value,
            // 선택한 날씨
            weather : weatherInput.value,
            // 작성 내용
            content : contentInput.value,
        }
        // console.log(data);
        // diary.push(data)
        // 수정모드 일때
        if(editId){
            diary = diary.map((item)=>{
                if(item.id === editId){
                    // 기존 데이터를 새 데이터로 변경
                    return{
                        // 기존 데이터를 복사
                        ...item,
                        // 새 값 덮어쓰기
                        date : dateInput.value,
                        mood : moodInput.value,
                        weather : weatherInput.value,
                        content : contentInput.value,
                    }
                }
                // 수정할 데이터가 아니면 그대로 반환
                return item
            })
            // 수정 완료했으면 다시 null
            editId = null
            // 버튼 글자 변경
            saveBtn.textContent = "기록저장"
        }else{
            // 새 글 추가
            diary.push(data)
        }
        resetForm()
        saveLocal() // 로컬스토리지에 저장
        render() // 화면 출력
      })

    //   화면 출력 함수 ====================================
    function render(){
        cards.innerHTML = ""
        // 데이터가 하나도 없으면
        if(diary.length === 0){
            cards.innerHTML = `<p class="empty">아직 기록이 아무것도 없습니다😓</p>`
        }
        // 배열 순서 뒤집기
        // [...diary] : 배열 복사 (최신 기록이 위로 오도록 만들기)
        const sorted = [...diary].reverse()
        // 내용 출력 카드
        sorted.forEach((item)=>{
            console.log(item);
            cards.innerHTML += `
            <div class="card">
                <div class="top">
                    <!-- 기분 -->
                     <div class="mood">${item.mood}</div>
                    <!-- 날씨 -->
                     <div class="weather">${item.weather}</div>
                </div>
                <!-- 날짜 -->
                 <div class="date">${item.date}</div>
                    <!-- 작성내용 -->
                     <div class="content">${item.content}</div>
                     <!-- 수정버튼 -->
                      <button class="edit-btn" onclick="editDiary(${item.id})">수정</button>
                      <!-- 삭제버튼 -->
                       <button class="delete-btn" onclick="deleteDiary(${item.id})">삭제</button>
             </div>
            `
        })

        // 통계 표시 ==================================================
        // 총 글의 갯수
        totalCount.textContent = diary.length
        // 글이 하나라도 있으면 최근 기분 저장
        if(diary.length > 0){
            // 가장 최근 기분 표시
            recentMood.textContent = diary[diary.length - 1].mood
        }
    }

    // 로컬에 저장 =====================================================
    function saveLocal(){
        localStorage.setItem("diary", JSON.stringify(diary))
    }

    // 삭제 함수 ========================================================
    window.deleteDiary = function(id){
        const result = confirm("삭제 하시겠습니까?")
        // 확인 버튼을 클릭시
        if(result){
            diary = diary.filter((item)=>item.id !== id)
        }
        // 로컬에 저장(업데이트)
        saveLocal()
        // 화면에 다시 출력
        render()
    }

    // 수정 함수 ========================================================
    window.editDiary = function(id){
        // 조건에 맞는 데이터를 1개 찾는다
        const target = diary.find((item)=>item.id === id)
            // 찾은 데이터 값을 입력칸에 넣기
            dateInput.value = target.date
            moodInput.value = target.mood
            weatherInput.value = target.weather
            contentInput.value = target.content
        // 현재 수정중인 id를 저장
        editId = id
        // 버튼 글자 변경
        saveBtn.textContent = "수정완료"
    }

    // 입력칸 초기화 함수 ================================================
    function resetForm(){
        // 내용 비우기
        contentInput.value = ""
        //기본 기분으로 변경
        moodInput.value = "😊"
        // 기본 날씨로 변경
        weatherInput.value = "☀"
    }

    // 전체 삭제 =========================================================
    allDeleteBtn.addEventListener("click", ()=>{
        // 기록 없으면 종료
        if(diary.length === 0){
            alert("삭제할 기록이 없습니다.")
            return
        }
        const result = confirm("전체 기록을 삭제 하시겠습니까?")
        // 배열 비우기
        if(result){
            diary = []
            // 로컬 삭제
            localStorage.removeItem("diary")
            // 화면 삭제
            render()
            // 입력창 초기화
            resetForm()
        }
    })
})