/**
 * Vietnamese Messages for Business Codes
 *
 * Vietnamese translations for all business error codes.
 */

import { MessageMap } from '../types';

export const viMessages: MessageMap = {
  // Success (0-99)
  0: 'Thao tác thành công',
  1: 'Tạo mới thành công',
  2: 'Cập nhật thành công',
  3: 'Xóa thành công',
  4: 'Yêu cầu đã được tiếp nhận',
  5: 'Không có thay đổi',

  // Auth (1xxx)
  1001: 'Xác thực thất bại',
  1002: 'Token đã hết hạn',
  1003: 'Token không hợp lệ',
  1004: 'Thiếu token xác thực',
  1005: 'Refresh token đã hết hạn',
  1006: 'Refresh token không hợp lệ',
  1007: 'Không đủ quyền truy cập',
  1008: 'Tài khoản đã bị khóa',
  1009: 'Tài khoản chưa được xác minh',
  1010: 'Phiên đăng nhập đã hết hạn',
  1011: 'API key không hợp lệ',
  1012: 'Quá nhiều lần đăng nhập thất bại',
  1013: 'Yêu cầu xác thực hai yếu tố',
  1014: 'Xác thực hai yếu tố thất bại',
  1015: 'Đăng nhập OAuth thất bại',
  1016: 'Lỗi nhà cung cấp OAuth',

  // User (2xxx)
  2001: 'Không tìm thấy người dùng',
  2002: 'Người dùng đã tồn tại',
  2003: 'Tài khoản không hoạt động',
  2004: 'Thông tin đăng nhập không đúng',
  2005: 'Tài khoản đã bị tạm ngưng',
  2006: 'Tài khoản đã bị xóa',
  2007: 'Email đã được sử dụng',
  2008: 'Tên đăng nhập đã được sử dụng',
  2009: 'Số điện thoại đã được sử dụng',
  2010: 'Email không đúng định dạng',
  2011: 'Mật khẩu quá yếu',
  2012: 'Mật khẩu không khớp',
  2013: 'Mật khẩu cũ không đúng',
  2014: 'Hồ sơ chưa hoàn thiện',

  // Validation (3xxx)
  3001: 'Lỗi xác thực dữ liệu',
  3002: 'Dữ liệu đầu vào không hợp lệ',
  3003: 'Thiếu trường bắt buộc',
  3004: 'Giá trị nằm ngoài phạm vi cho phép',
  3005: 'Định dạng không hợp lệ',
  3006: 'Trường quá dài',
  3007: 'Trường quá ngắn',
  3008: 'Định dạng ngày không hợp lệ',
  3009: 'Ngày không thể ở quá khứ',
  3010: 'Ngày không thể ở tương lai',
  3011: 'Loại tệp không hợp lệ',
  3012: 'Kích thước tệp quá lớn',
  3013: 'Định dạng JSON không hợp lệ',
  3014: 'Định dạng UUID không hợp lệ',
  3015: 'Số điện thoại không hợp lệ',
  3016: 'Dữ liệu bị trùng lặp',

  // Resource (4xxx)
  4001: 'Không tìm thấy tài nguyên',
  4002: 'Tài nguyên đã tồn tại',
  4003: 'Tài nguyên đang bị khóa',
  4004: 'Tài nguyên đã bị xóa',
  4005: 'Tài nguyên đã hết hạn',
  4006: 'Đã đạt giới hạn tài nguyên',
  4007: 'Tài nguyên không khả dụng',
  4008: 'Xung đột tài nguyên',
  4009: 'Phiên bản không khớp',
  4010: 'Không thể xóa tài nguyên có phụ thuộc',

  // Server (5xxx)
  5001: 'Lỗi máy chủ nội bộ',
  5002: 'Lỗi cơ sở dữ liệu',
  5003: 'Lỗi dịch vụ bên ngoài',
  5004: 'Dịch vụ tạm thời không khả dụng',
  5005: 'Lỗi cấu hình',
  5006: 'Lỗi bộ nhớ đệm',
  5007: 'Lỗi hệ thống tệp',
  5008: 'Vượt quá giới hạn bộ nhớ',
  5009: 'Thao tác quá thời gian',
  5010: 'Lỗi hàng đợi',

  // External (6xxx)
  6001: 'Lỗi API bên thứ ba',
  6002: 'Lỗi cổng thanh toán',
  6003: 'Lỗi dịch vụ email',
  6004: 'Lỗi dịch vụ SMS',
  6005: 'Lỗi dịch vụ lưu trữ',
  6006: 'Lỗi dịch vụ tìm kiếm',
  6007: 'Lỗi dịch vụ thông báo',
  6008: 'Lỗi dịch vụ phân tích',

  // Business (7xxx)
  7001: 'Thao tác không được phép',
  7002: 'Số dư không đủ',
  7003: 'Giao dịch thất bại',
  7004: 'Không thể hủy đơn hàng',
  7005: 'Không thể chỉnh sửa đơn hàng',
  7006: 'Sản phẩm hết hàng',
  7007: 'Mã giảm giá không hợp lệ',
  7008: 'Mã giảm giá đã hết hạn',
  7009: 'Chưa đạt giá trị đơn hàng tối thiểu',
  7010: 'Vượt quá số lượng tối đa',
  7011: 'Yêu cầu đăng ký gói dịch vụ',
  7012: 'Gói đăng ký đã hết hạn',
  7013: 'Tính năng không khả dụng',
  7014: 'Đã vượt quá hạn mức',
  7015: 'Đã vượt quá giới hạn tần suất',
};
