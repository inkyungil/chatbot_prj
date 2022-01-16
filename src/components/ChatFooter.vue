<template>
  <div id="footer" style="bottom: 0px;">

    <div class="slide_btn"><img src="../static/images/btn_tog.png" border="0"></div>
    <div class="fixed_option_box close">
      <div class="box">
        <div class="box-body">
          <button type="button" class="btn-slide btn-default btn-block ts_all" onclick="talk_start_click('여행상품 예약 방법')" >여행상품 예약 방법</button>
          <button type="button" class="btn-slide btn-default btn-block ts_all" onclick="talk_start_click('SNS 할인 이벤트')" >SNS 할인 이벤트</button>
          <button type="button" class="btn-slide btn-default btn-block ts_all" onclick="talk_start_click('여행상품 추천')" >여행상품 추천</button>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="ui_holder">
          <div class="col_group">
            <div id="quick_home_btn">
              <button type="button" id="quick_slider_open" class="active ts_all">
              <i class="ico_ui_menu_bar"></i>
              </button>
            </div>
            <div>
              <button type="button" id="send" class="ts_all"><i class="ico_ui_send"></i></button>
            </div>
            <div id="talkText_input">
              <input type="text" name="talkText" id="talkText" class="placeholdercolor ts_all" placeholder="새로운 검색어 입력 시 홈 버튼 클릭" style="background-color: rgb(221, 221, 221); padding-left: 15px;">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>
