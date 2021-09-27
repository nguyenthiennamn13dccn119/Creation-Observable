//RxJs create operators.

// of()
// of() là một opertors dùng để tạo observable từ bất cứ giá trị gì: primitives, Array, Object, Function v.v sẽ nhận vào các giá trị và sẽ complete ngay sau khi tất cả các giá trị truyền vào được emit.

// 1. primitive value
import {
  of,
  from,
  fromEvent,
  fromEventPattern,
  interval,
  timer,
  throwError,
  defer,
} from 'rxjs';

const observer = {
  next: (val: any) => console.log(val),
  error: (err: any) => console.log(err),
  complete: () => console.log('Done'),
};

// 1. primitive
of('hello Nam').subscribe(observer);

// 2. Object/Array
of([1, 2, 3]).subscribe(observer);

// 3. list value (sequence of values)
of(1, 2, 3, 'hello', 'world', { name: 'Nguyen Thien Nam' }).subscribe(observer);

// from()
// from gần giống of(), cũng được sủ dụng để tạo observable từ một giá trị. Tuy nhiên điểm khác biệt giữa of() và from() là from() chỉ nhận vào một giá trị là một Iterable hoặc là một Promise.

// Iterable là những giá trị có thẻ iterate qua được, ví dụ: array, map, set hoặc string. Khi loop qua string thì sẽ nhận được là dãy các kí tự trong string.

// 1. Array
from([1, 2, 3]).subscribe(observer);
// 2. string
from('Nguyen Thien Nam').subscribe(observer);
// 3. Map/Set
const map = new Map();

map.set(1, 'hello');
map.set(2, 'Nguyen Thien Nam');

from(map).subscribe(observer);

const set = new Set();

set.add(1);
set.add(2);
from(set).subscribe(observer);
//4. Promise

from(Promise.resolve('Hello, Nguyen Thien Nam')).subscribe(observer);

// formEvent()
// formEvent được dùng để chuyển đổi một sự kiện (Event) sang Observable. Ví dụ: dom event: mouse click hoặc input.

const btn = document.querySelector('#btn');
const input = document.querySelector('#input');

// output (example): MouseEvent {...}
// complete: không có gì log.
fromEvent(btn, 'click').subscribe(observer);

// output (example): KeyboardEvent {...}
// complete: không có gì log.
fromEvent(input, 'keydown').subscribe(observer);

// fromEvent tạo một observable không tụ complete => việc này là hoàn toàn hợp lí vì chúng ta cần lắng nghe các sự kiện như click, keydown cho đến khi nào chính chúng ta không cần lắng nghe nữa thì thôi. fromEvent() không thể quyết định được lúc nào chúng ta không cần những sự kiện này nữa. => Đồng nghĩa với việc chúng ta phải chủ động unsubscricbe() các observable tạo từ fromEvent() nếu không muốn bị tràn bộ nhớ(memory leak).

//fromEventPattern()

// fromEventPattern() là một dạng nâng cao của fromEvent(). Nói về concept thì fromEventPattern() giống vơi fromEvent() là tạo từ Observable sự kiện. Tuy nhiên fromEventPattern() rất khác về cách dùng, cũng như loại sự kiện đẻ xủ lý. Ví dụ:.

fromEventPattern(
  (handler) => {
    btn.addEventListener('click', handler);
  },
  (handler) => {
    btn.addEventListener('click', handler);
  }
).subscribe(observer);

// Ví dụ: Nếu chúng ta cần biết được vị trí con trỏ chuột trên element được click.
function addHandler(handler) {
  btn.addEventListener('click', handler);
}

function removeHandler(handler) {
  btn.removeEventListener('click', handler);
}

fromEventPattern(
  addHandler,
  removeHandler,
  (ev: MouseEvent) => ev.offsetX + ' ' + ev.offsetY
).subscribe(observer);

// interval()
// interval() là hàm tạo observable mà sẽ emit gía trị từ 0 theo 1 chu kỳ nhất định. Hàm này giống với setInterval.

const a = interval(1000).subscribe(observer);

setInterval(() => a.unsubscribe(), 3000);

// giống như fromEvent() interval() không tự unsubscribe nên chúng ta phải xử lý unsubscribe cho nó.

// timer()
// timer có hai cách sử dụng:
// . Tạo một Observable mà sẽ emit giá trị sau 1 khoảng thời gian nhất định => cách này sẽ tự complete.
// . Tạo một Observable mà sẽ emit giá trị sau 1 khoảng thời gian và sẽ emit giá trị sau mỗi chu kỳ đó. Cách dùng này tương tự với interval() nhưng timer() hỗ trợ delay trước khi emit => không tự complete.

// sau 1 s => trả số 0.
timer(1000).subscribe(observer);

// sau 1s và lặp lại sau 1 s.
const b = timer(1000, 1000).subscribe(observer);
setInterval(() => b.unsubscribe(), 5000);

// throwError()
// throwError() dùng để tạo 1 Observable thay vì để emit giá trị thì Observable này dùng để throw 1 error ngay lập tức khi sau subscribe.

throwError(() => console.log('an error')).subscribe(observer);

// throwError() thường được dùng trong việc xử lý lỗi Observable. Sau khi xử lý lỗi chúng ta muốn xử lý tiếp error cho  Errorhandler tiếp theo, chúng ta sẽ dùng throwError(). Khi làm việc với Observable, có 1 số Operators yêu cầu chúng ta phải cung cấp 1 Observable (ví dụ như switchMap, catchError) thì việc  throwEror trả về 1 Observer là rất thích hợp.

// defer()
// Cuối cùng chúng ta tìm hiểu 1 Observable rất hay đó là defer(). defer() nhận vào 1 ObservableFactory và sẽ trả về Observable này. Điểm đặc biệt của defer() ở việc defer() sẽ dùng ObserableFactory này để tạo  1 Observable  mới cho mỗi Subscribler.

// of()
const now$ = of(Math.random());

now$.subscribe(observer);
now$.subscribe(observer);
now$.subscribe(observer);

// defer()

const now1$ = defer(() => of(Math.random()));

now1$.subscribe(observer);
now1$.subscribe(observer);
now1$.subscribe(observer);
// Với defer() => chúng ta đã có 3 giá trị khác nhau cho mỗi lần subscribe. Điều này giúp ích ở điểm nào? Ví dụ trường hợp chúng ta cần retry 1 Observable nào đó mà cần so sánh với 1 giá trị random để quyết định xem có chạy tiếp hay không => defer() kết hợp với retry  là 1 giâỉ pháp cực kỳ hiệu quả.
